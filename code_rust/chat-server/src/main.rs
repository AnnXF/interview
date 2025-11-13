use tokio::{
    io::{self, AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::TcpListener,
    signal,
    sync::broadcast,
};
use tokio_util::sync::CancellationToken;

// client test: nc localhost 8888
#[tokio::main]
async fn main() -> io::Result<()> {
    let subscriber = tracing_subscriber::FmtSubscriber::new();
    tracing::subscriber::set_global_default(subscriber).unwrap();

    let listener = TcpListener::bind("127.0.0.1:8888").await?;
    let (tx, _) = broadcast::channel(10);

    let token = CancellationToken::new();
    let cancel_token = token.clone();

    tokio::spawn(async move {
        match signal::ctrl_c().await {
            Ok(()) => {
                tracing::warn!(" shutdown task!!!");
                cancel_token.cancel();
            }
            Err(err) => {
                tracing::error!(" err {err:#?} ");
            }
        }
    });

    loop {
        let (mut socket, addr) = listener.accept().await.unwrap();

        let tx = tx.clone();
        let mut rx = tx.subscribe();

        let token = token.clone();

        tokio::spawn(async move {
            let (stream_reader, mut stream_writer) = socket.split();
            let mut messsage = String::new();
            let mut reader = BufReader::new(stream_reader);
            tracing::info!(" new connection {addr:#?}");
            loop {
                tokio::select! {
                    result = reader.read_line(&mut messsage) => {
                        if result.unwrap() == 0 {
                            break;
                        }
                        tx.send((messsage.clone(), addr)).unwrap();
                        messsage.clear();
                    }
                    result = rx.recv() =>{
                        let (receive_message, sender_addr) = result.unwrap();
                        if sender_addr != addr{
                            stream_writer
                                .write_all(receive_message.as_bytes())
                                .await
                                .unwrap();
                        }
                    }
                    _ = token.cancelled() =>{
                        tracing::info!("cleaning up!!!");
                        return
                    }
                }
            }
        });
    }
}
