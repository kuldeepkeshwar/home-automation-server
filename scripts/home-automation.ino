#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>

#define STASSID "kuldeep keshwar"
#define STAPSK  "9004925450"
#define SERVER_BASE_URL  "https://smart-home-agent.now.sh"
#define BOARD_NAME "living-room"
#define CONNECTION_FAILED  "{ success:0,message:\"CONNECTION_FAILED\"}"
#define TOTAL_PINS  20
#define INITIAL_ID  "-1"
const char fingerprint[] PROGMEM = "72 94 95 F1 6C BE 08 C2 7B E4 5D 0C 79 66 74 2B 89 1C C4 42";

WiFiClientSecure client;
ESP8266WebServer server(80);

int pins[TOTAL_PINS];
int values[TOTAL_PINS];
String id = INITIAL_ID;

void handleRoot() {
  digitalWrite(LED_BUILTIN, LOW);
  String str = String("Device: " + String(id) + " Status !!! \n");
  for (int i = 0; i < TOTAL_PINS; i++) {
    str = str + "Pin " + String(pins[i]) + "=" + values[i] + " \n";
  }
  server.send(200, "text/plain", str);
  digitalWrite(LED_BUILTIN, HIGH);
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}
JsonObject& makePostCall(String url, String payload) {
  std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
  client->setFingerprint(fingerprint);
  HTTPClient https;

  const size_t bufferSize = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(8) + 370;
  DynamicJsonBuffer jsonBuffer(bufferSize);
  if (https.begin(*client, url)) {
    https.addHeader("Content-Type", "application/x-www-form-urlencoded");
    Serial.print("[HTTPS] POST...");
    Serial.println(url);
    Serial.println(payload);

    int httpCode = https.POST(payload);
    String resp = https.getString();
    Serial.printf("[HTTPS] POST... code: %d\n", httpCode);
    Serial.print("[HTTPS] POST... resp: ");
    Serial.println(resp);

    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        return jsonBuffer.parseObject(resp);
      }
    } else {
      Serial.printf("[HTTPS] POST... failed, error: %s\n", https.errorToString(httpCode).c_str());
    }
    https.end();
  } else {
    Serial.printf("[HTTPS] Unable to connect\n");
  }
  return jsonBuffer.parseObject(CONNECTION_FAILED);

}
JsonObject& makeGetCall(String url) {
  std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
  client->setFingerprint(fingerprint);
  HTTPClient https;

  const size_t bufferSize = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(8) + 370;
  DynamicJsonBuffer jsonBuffer(bufferSize);

  if (https.begin(*client, url)) {

    Serial.print("[HTTPS] GET...");
    Serial.println(url);

    int httpCode = https.GET();
    String resp = https.getString();
    Serial.printf("[HTTPS] GET... code: %d\n", httpCode);

    Serial.print("[HTTPS] GET... resp: ");
    Serial.println(resp);

    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        return jsonBuffer.parseObject(resp);
      }
    } else {
      Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
    }
    https.end();
  } else {
    Serial.printf("[HTTPS] Unable to connect\n");
  }
  return jsonBuffer.parseObject(CONNECTION_FAILED);
}
String registerDevice() {
  String url = String(SERVER_BASE_URL) + "/api/devices";
  String payload = "ip=" + WiFi.localIP().toString() + "&name=" + BOARD_NAME;
  JsonObject&  root = makePostCall(url, payload);
  if (root["success"]) {
    id = root["data"]["id"].as<String>();
    int len = root["data"]["pins"].size();
    for (int i = 0; i < len; i++) {
      int pin = root["data"]["pins"][i];
      int val = root["data"]["status"][i];
      pins[i] = pin;
      values[i] = val;
      pinMode(pin, OUTPUT);
      digitalWrite(pin, val);
      Serial.print(" pin: ");
      Serial.print(pin);
      Serial.print(" status: ");
      Serial.println(val);
    }
    Serial.println(" payload: " + payload);
  } else {
    Serial.println(" Error in while registering device");
    String msg = root["message"];
    Serial.println(msg);
  }
  return id;
}
bool updateMeta(bool reset, bool syncd) {
  String url = String(SERVER_BASE_URL) + "/api/devices/";
  url = String(url) + id + "/meta";
  String payload = String("reset=") + reset + "&syncd=" + syncd;
  JsonObject&  root = makePostCall(url, payload);
  if (root["success"]) {
    Serial.println("updateMeta: payload: " + payload);
    return true;
  } else {
    Serial.println(" Error in while updating Meta");
    String msg = root["message"];
    Serial.println(msg);
  }
  return false;
}

void heartbeat() {
  String url = String(SERVER_BASE_URL) + "/api/devices/";
  url = String(url) + id + "/heartbeat";
  JsonObject& root = makeGetCall(url);
  if (root["success"]) {
    bool syncd = root["data"]["syncd"];
    bool reset = root["data"]["reset"];
    if (reset) {
      if (updateMeta(false, syncd)) {
        ESP.reset();
      }
    }
    if (!syncd) {
      fetchPinStatus();
      updateMeta(reset, true);
    }
  } else {
    Serial.println(" Error in while heartbeat");
    String msg = root["message"];
    Serial.println(msg);
  }
}
void fetchPinStatus() {
  String url = String(SERVER_BASE_URL) + "/api/devices/";
  url = String(url) + id;
  JsonObject& root = makeGetCall(url);
  if (root["success"]) {
    int len = root["data"]["pins"].size();
    for (int i = 0; i < len; i++) {
      int pin = root["data"]["pins"][i];
      int val = root["data"]["status"][i];
      int current = values[i];
      if (current != val) {
        digitalWrite(pin, val);
        pins[i] = pin;
        values[i] = val;
        Serial.print(" setting pin: ");
        Serial.print(pin);
        Serial.print(" previous: ");
        Serial.print(current);
        Serial.print(" current: ");
        Serial.println(val);
      }
    }
  } else {
    Serial.println(" Error in while fetching pin state");
    String msg = root["message"];
    Serial.println(msg);
    if (root.containsKey("code") && root["code"] == 404) {
      connectToPublicServer();
    }
  }
}
void connectToPublicServer() {
  while (registerDevice().equals(INITIAL_ID)) {
    delay(10);
    Serial.println(" trying to connect to server !!!");
  }
}

void connectToWiFi() {
  Serial.begin(115200);
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(STASSID);

  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(10);
    Serial.print(".");
  }
  Serial.println(" WiFi connected");

  // Print the IP address
  Serial.println(" Use this URL to connect: " + WiFi.localIP().toString());

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.println(rssi);

}
void setupWebServer() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  if (MDNS.begin(BOARD_NAME)) {
    Serial.println("MDNS responder started");
  }
  server.on("/", handleRoot);
  //  server.on("/inline", []() {
  //    server.send(200, "text/plain", "this works as well");
  //  });
  server.onNotFound(handleNotFound);
  server.begin();
  MDNS.addService("http", "tcp", 80);
  Serial.println("HTTP server started");
}
void setup() {
  connectToWiFi();
  setupWebServer();
  Serial.println(" setup completed !!!");
  connectToPublicServer();
}
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    heartbeat();
    server.handleClient();
    MDNS.update();
  }
}
