import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYxMDhFNGQwMkRBNTk3NzQ0RUM4M0JiMUY2NDIyODA3NEE1MjJmNEUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzcwOTM4OTk2NjYsIm5hbWUiOiJTeXRpbWUifQ.YCCi50dr2kv26AK4ZNo52eHDFTPaXSd6u9Q9r1rRT0k";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}
export default makeStorageClient();
