use reqwest::{Client, Method};
use std::time::Duration;

const REPORT_BODY: &str = r#"<?xml version="1.0" encoding="utf-8" ?>
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop><d:getetag/><c:calendar-data/></d:prop>
  <c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT"/></c:comp-filter></c:filter>
</c:calendar-query>"#;

#[tauri::command]
async fn fetch_calendar(url: String, username: String, password: String) -> Result<String, String> {
    let parsed = url::Url::parse(&url).map_err(|_| "Enter a valid calendar URL.".to_string())?;
    if parsed.scheme() != "https" && parsed.scheme() != "http" {
        return Err("Calendar URLs must use HTTPS or HTTP.".into());
    }
    let client = Client::builder()
        .timeout(Duration::from_secs(30))
        .redirect(reqwest::redirect::Policy::limited(5))
        .build()
        .map_err(|_| "Could not prepare the secure connection.".to_string())?;
    let is_ics = parsed.path().to_ascii_lowercase().ends_with(".ics");
    let method = if is_ics { Method::GET } else { Method::from_bytes(b"REPORT").unwrap() };
    let mut request = client.request(method, parsed).header("User-Agent", "Calendar-Snapshotter/0.1");
    if !username.is_empty() {
        request = request.basic_auth(username, Some(password));
    }
    if !is_ics {
        request = request
            .header("Depth", "1")
            .header("Content-Type", "application/xml; charset=utf-8")
            .body(REPORT_BODY);
    }
    let response = request.send().await.map_err(|error| format!("Calendar connection failed: {error}"))?;
    let status = response.status();
    if !status.is_success() && status.as_u16() != 207 {
        return Err(format!("Calendar server returned {status}."));
    }
    if response.content_length().unwrap_or(0) > 20 * 1024 * 1024 {
        return Err("Calendar response is larger than the 20 MB safety limit.".into());
    }
    response.text().await.map_err(|_| "Calendar data was not valid text.".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_calendar])
        .run(tauri::generate_context!())
        .expect("error while running Calendar Snapshotter");
}
