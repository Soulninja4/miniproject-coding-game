<script>
  import Sk from "skulpt";
  import CodeMirror from "svelte-codemirror-editor";
  import { oneDark } from "@codemirror/theme-one-dark";

  // import { EditorView } from "@codemirror/view";

  let value = "";
  function outf(text) {
    var mypre = document.getElementById("output");
    mypre.innerHTML = mypre.innerHTML + text;
  }

  function builtinRead(x) {
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles["files"][x] === undefined
    )
      throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
  }

  // Here's everything you need to run a python program in skulpt
  // grab the code from your textarea
  // get a reference to your pre element for output
  // configure the output function
  // call Sk.importMainWithBody()
  function runit() {
    var prog = value;
    var mypre = document.getElementById("output");
    mypre.innerHTML = "";
    Sk.pre = "output";
    Sk.configure({ output: outf, read: builtinRead, __future__: Sk.python3 });
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "mycanvas";
    var myPromise = Sk.misceval.asyncToPromise(function () {
      return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(
      function (mod) {
        console.log("success");
      },
      function (err) {
        console.log(err.toString());
      }
    );
  }
</script>

<div class="relative bottom-0 left-0 w-full h-1/3">
  <!-- <div class="h-[70vh]">hi</div> -->
  <CodeMirror
    bind:value
    theme={oneDark}
    styles={{
      "&": {
        width: "100%",
        height: "30vh",
      },
    }}
  />
  <button
    class=" absolute bottom-0 right-5 text-white z-10"
    type="button"
    on:click={runit}>Submit</button
  >
  <pre id="output" />
</div>
