// Write a function that takes a slice of strings and returns the first string that appears only once. Use goroutines to process the strings concurrently.
// Example Input:
// ["apple", "banana", "apple", "cherry", "banana", "date"]
// Expected Output:
// "cherry"

use std::collections::HashMap;

async fn find_first_uniq_str(data: Vec<String>, worker_count: usize) -> Option<String> {
    if data.is_empty() {
        return None;
    }

    let chunk_size = (data.len() + worker_count - 1) / worker_count;
    let mut handles = Vec::new();

    for chunk in data.chunks(chunk_size) {
        let chunk = chunk.to_vec();

        let handle = tokio::spawn(async {
            // reduce the granulate of the lock
            let mut local_map = HashMap::new();
            for word in chunk {
                *local_map.entry(word).or_insert(0) += 1
            }
            local_map
        });
        handles.push(handle);
    }

    let mut gloable_map = HashMap::new();
    for handle in handles {
        let local_map = handle.await.unwrap();
        for (k, v) in local_map {
            *gloable_map.entry(k).or_insert(0) += v
        }
    }

    for word in data {
        if let Some(&count) = gloable_map.get(&word) {
            if count == 1 {
                return Some(word);
            }
        }
    }

    return None;
}


#[tokio::main]
async fn main() {
    let input = vec![
        "apple".to_string(),
        "banana".to_string(),
        "apple".to_string(),
        "cherry".to_string(),
        "banana".to_string(),
        "date".to_string(),
    ];

    let res = find_first_uniq_str(input, 3).await;
    println!("{:?}", res); // 输出: Some("cherry")
}
