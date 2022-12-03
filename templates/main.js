//const usernameInput = document.getElementById('exampleFormControlInput1');
let btn = document.getElementById("submit-btnn")
const inpfile = document.getElementById('audioFileChooser')

const subbtn = (event) => {
    //console.log("Hi")
    event.preventDefault()
    let formdata = new FormData()
    formdata.append("file", inpfile.files[0]);

    console.log(inpfile.files[0]);
    fetch('http://127.0.0.1:8080/', {
        method: "post",
        body: formdata
    }).then(res => res.body)
        .then(rb => {
            // console.log(res);
            const reader = rb.getReader();
            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                console.log('done', done);
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            console.log(done, value);
                            push();
                        })
                    }
                    push();
                }
            });
        })
        .then(stream => {
            // Respond with our stream
            return new Response(stream, { headers: { "Content-Type": "text/csv" } }).text();
        })
        .then(result => {
            // Do things with result
            formdata = null;
           // result = JSON.parse(result)
            console.log(result);
       })
        .catch(e => console.log(e))
}
    // formdata.append("username", usernameInput.value)
    // fetch("http://127.0.0.1:8080/", {
    //    method : 'post',
    //    body: formdata
    // })

btn.addEventListener("click", subbtn)