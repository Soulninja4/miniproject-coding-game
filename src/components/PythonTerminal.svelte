<script>
  import Sk from "skulpt";
  // output functions are configurable.  This one just appends some text
  // to a pre element.
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
    var prog = document.getElementById("code-editor").value;
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

<body>
  <form>
    <textarea
      id="code-editor"
      cols="40"
      rows="10"
      class="w-full h-1/3 bg-gray-900 text-white p-4"
      >print('test')
    </textarea><br />
    <button type="button" on:click={runit}>Vedi</button>
  </form>
  <pre id="output" />
</body>

<style>
  #code-editor {
    font-family: "Fira Code", monospace;
    font-size: 16px;
    line-height: 1.5;
    border: none;
    border-radius: 0;
  }
</style>
