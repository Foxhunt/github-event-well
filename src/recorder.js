import download from "downloadjs"

export default class Recorder extends MediaRecorder {
  constructor(canvas) {
    super(canvas.captureStream(60), { mimeType: "video/webm;codecs=h264" })
    this.chunks = []
    this.ondataavailable = this.handleData
  }

  handleData(event) {
    if (event.data && event.data.size > 0) {
      this.chunks.push(event.data)
    }
  }

  start() {
    super.start(1000)
    console.log("started recording")
  }

  stop() {
    super.stop()
    this.exportVideo()
    console.log("stoped recording")
  }

  exportVideo() {
    const blob = new Blob(this.chunks, { type: "video/webm" })
    if (blob.size > 0) {
      download(blob, "penn.webm", "video/webm")
      this.chunks = []
    }
  }
}
