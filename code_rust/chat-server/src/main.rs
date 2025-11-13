use tokio::{
    io::{self, AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::TcpListener,
    sync::broadcast,
};

#[tokio::main]
async fn main() -> io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:8888").await?;
    let (tx, _) = broadcast::channel(10);
    loop {
        let (mut socket, addr) = listener.accept().await.unwrap();
        let tx = tx.clone();
        let mut rx = tx.subscribe();
        tokio::spawn(async move {
            let (stream_reader, mut stream_writer) = socket.split();
            let mut messsage = String::new();
            let mut reader = BufReader::new(stream_reader);
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
                }
            }
        });
    }
}
