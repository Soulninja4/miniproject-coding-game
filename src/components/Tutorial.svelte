<script>
  import { onMount } from "svelte";

  export let currentPage = 1;
  export let totalPages = 3;
  export let onNextPage;
  export let gameState;

  const tutorialContent = [
    {
      imageSrc: "src/assets/tutorial/tutimage1.png",
      text1: `Welcome to the world of programming!`,
      text2: `In programming, a variable is a named container that stores information. It's like a labeled box where you can put different things. To create a variable, you give it a name and assign a value to it.`,
      text3: `Variables store data and can be used to manipulate and update values during program execution. For example, "score" is a variable name assigned the value of 100, which can be changed as needed.`,
    },
    {
      imageSrc: "src/assets/tutorial/tutimage2.png",
      text1: `The print() function in programming displays output on the screen.`,
      text2: `It is used to show messages, values, or variables during program execution.`,
      text3: `For example: print("Hello, World!") will display "Hello, World!" on the screen.`,
    },
    {
      imageSrc: "src/assets/tutorial/tutimage3.png",
      text1: `Monsters are going to appear on screen, and you need to defeat them before they invade your dome`,
      text2: `They all have a crucial weakness, which is displayed in the bubble above them.`,
      text3: `Using what we have just shown you, display their weakness to destroy them by using the print() function.`,
    },
  ];
</script>

{#if gameState !== "playing" && currentPage <= totalPages}
  <div class="tutorial-container">
    <div class="tutorial-image">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img
        src={tutorialContent[currentPage - 1].imageSrc}
        alt="Tutorial Image"
      />
    </div>
    <div class="tutorial-content">
      <div class="tutorial-text">
        <p>{tutorialContent[currentPage - 1].text1}</p>
        <br />
        <p>{tutorialContent[currentPage - 1].text2}</p>
        <br />
        <p>{tutorialContent[currentPage - 1].text3}</p>
      </div>
      {#if currentPage !== totalPages}
        <button class="tutorial-button" on:click={onNextPage}>Next</button>
      {:else}
        <button class="tutorial-button" on:click={onNextPage}>Finish</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .tutorial-container {
    position: absolute;
    top: 0;
    left: 0;
    /* transform: translate(-50%, -50%); */
    background-color: #111127;
    padding: 20px;
    border-radius: 10px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* max-width: 500px; */
    height: 76vh;
  }

  .tutorial-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tutorial-image img {
    max-height: 300px;
    max-width: 100%;
  }

  .tutorial-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .tutorial-text {
    font-size: 20px;
    line-height: 1.5;
    margin-bottom: 20px;
    margin-right: 400px;
  }

  .tutorial-button {
    background-color: white;
    color: #111127;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    position: absolute;
    bottom: 200px;
    right: 300px;
  }
</style>
