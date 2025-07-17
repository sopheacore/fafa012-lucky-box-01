    const boxes = document.querySelectorAll('.box');
    const playButton = document.getElementById('play-button');
    const popup = document.getElementById('popup');
    const resultImg = document.getElementById('resultImg');
    const actionButton = document.getElementById('actionButton');
    const boomSound1 = document.getElementById('boomSound1');
    const boomSound2 = document.getElementById('boomSound2');
    const winSound1 = document.getElementById('winSound1');
    const winSound2 = document.getElementById('winSound2');
    const bgMusic = document.getElementById('bgMusic');
    const buttonSound = new Audio('./assets/button-click.mp3');
    let playCount = 0;

    document.addEventListener('click', () => {
      bgMusic.volume = 0.3;
      if (bgMusic.paused) bgMusic.play();
    });

    function playBoom() { boomSound1.currentTime = 0; boomSound1.play(); boomSound2.currentTime = 0; boomSound2.play(); }
    function playWin() { winSound1.currentTime = 0; winSound1.play(); winSound2.currentTime = 0; winSound2.play(); }
    function playButtonSound() { buttonSound.currentTime = 0; buttonSound.play(); }
    function resetBoxes() {
      boxes.forEach(b => {
        b.style.backgroundImage = "url('./assets/gold-box.webp')";
        b.classList.remove('loss', 'win', 'zoom');
        b.style.pointerEvents = 'none';
      });
    }

    playButton.addEventListener('click', () => {
      playButtonSound();
      playCount++;
      playButton.style.display = 'none';
      boxes.forEach(box => {
        box.classList.add('zoom');
        box.style.pointerEvents = 'auto';
      });

      // ✅ Fire Play event
      fbq('trackCustom', 'Play', {
        content_name: 'Play Button Click'
      });
    });

    boxes.forEach(box => {
      box.addEventListener('click', () => {
        playButtonSound();
        boxes.forEach(b => b.classList.remove('zoom'));
        boxes.forEach(b => b.style.pointerEvents = 'none');

        if (playCount === 1) {
          box.classList.add('loss');
          setTimeout(() => {
            box.style.backgroundImage = "url('./assets/bomb.gif')";
            playBoom();
          }, 700);
          setTimeout(() => {
            resultImg.src = './assets/thank-you.webp';
            actionButton.innerHTML = `
              <button id="try-again-btn" style="background:none;border:none;padding:0;">
                <img src="./assets/try-again-button.gif" alt="Try Again" />
              </button>
            `;
            popup.style.display = 'flex';
            requestAnimationFrame(() => popup.classList.add('show'));
            confettiSmall();

            // ✅ Fire PlayAgain when Try Again clicked
            const tryAgainBtn = document.getElementById('try-again-btn');
            if (tryAgainBtn) {
              tryAgainBtn.addEventListener('click', () => {
                fbq('trackCustom', 'PlayAgain', {
                  content_name: 'Try Again Click'
                });
              });
            }
          }, 2000);
        } else if (playCount === 2) {
          resetBoxes();
          box.classList.add('win');
          setTimeout(() => {
            box.style.backgroundImage = "url('./assets/star.gif')";
            playWin();
          }, 700);
          setTimeout(() => {
            resultImg.src = './assets/you-get-2usd.webp';
            actionButton.innerHTML = `
              <a id="claim-button" href="https://t.me/m/8efXjOmkY2U9" target="_blank">
                <img src="./assets/claim-button.gif" alt="Claim" />
              </a>
            `;
            popup.style.display = 'flex';
            requestAnimationFrame(() => popup.classList.add('show'));
            confettiCelebrateLoop();

            // ✅ Fire Purchase on Claim click
            const claimBtn = document.getElementById('claim-button');
            if (claimBtn) {
              claimBtn.addEventListener('click', () => {
                fbq('track', 'Purchase', {
                  value: 2.00,
                  currency: 'USD',
                  content_name: 'Claim Button Click'
                });
              });
            }
          }, 2000);
        }
      });
    });

    actionButton.addEventListener('click', () => {
      playButtonSound();
      popup.classList.remove('show');
      setTimeout(() => popup.style.display = 'none', 500);
      resetBoxes();
      if (playCount === 1) {
        playButton.style.display = 'block';
      }
    });

    function confettiSmall() {
      confetti({ particleCount: 40, spread: 80, colors: ['#ffffff'], origin: { y: 0.5 } });
    }
    function confettiCelebrateLoop() {
      let isCelebrating = true;
      function fireConfetti() {
        if (!isCelebrating) return;
        confetti({ particleCount: 70, spread: 360, startVelocity: 40, ticks: 80, origin: { y: 0.5 } });
        setTimeout(fireConfetti, 2000);
      }
      fireConfetti();
      actionButton.addEventListener('click', () => { isCelebrating = false; });
    }


    // ✅ Loading

    window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('landing').classList.remove('hidden');
    });

