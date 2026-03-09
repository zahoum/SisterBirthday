import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {

  const [introVisible, setIntroVisible] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [giftOpen, setGiftOpen] = useState(false);
  const [hideGift, setHideGift] = useState(false);
  const [cakeVisible, setCakeVisible] = useState(false);

  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const canvasRef = useRef(null);
  const confettiRef = useRef(null);
  const audioRef = useRef(null);

  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const texts = [
    "Dear Sister... 💝",
    "Happy 23rd Birthday Khaoula Zahoum! 🎉",
    "Click the gift to reveal your surprise 🎁"
  ];

  /* --------------------------
     BIRTHDAY EMOJI RAIN
  --------------------------- */

  useEffect(() => {
    const container = document.querySelector(".birthday-rain");
    if (!container) return;

    const items = ["🎈","🎉","🎁","🎂","✨","💖"];

    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div");

      el.className = "rain-item";
      el.innerText = items[Math.floor(Math.random()*items.length)];

      el.style.left = Math.random()*100 + "%";
      el.style.animationDuration = 5 + Math.random()*6 + "s";
      el.style.animationDelay = Math.random()*5 + "s";
      el.style.fontSize = 20 + Math.random()*20 + "px";

      container.appendChild(el);
    }

  }, []);

  /* --------------------------
     TYPING INTRO
  --------------------------- */

  useEffect(() => {

    if (!introVisible) return;

    const typeText = () => {

      if (charIndex < texts[textIndex].length) {

        setTypingText(prev => prev + texts[textIndex].charAt(charIndex));
        setCharIndex(prev => prev + 1);

      } else {

        setTimeout(() => {

          setTypingText("");
          setCharIndex(0);

          if (textIndex < texts.length - 1) {

            setTextIndex(prev => prev + 1);

          } else {

            setTimeout(() => {
              setIntroVisible(false);
              setMainVisible(true);
            },1200);

          }

        },1800);

      }

    };

    const timeout = setTimeout(typeText,80);
    return () => clearTimeout(timeout);

  },[charIndex,textIndex,introVisible]);

  /* --------------------------
     FIREWORKS
  --------------------------- */

  useEffect(() => {

    if (!mainVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize",resizeCanvas);

    const interval = setInterval(() => {

      const particles = particlesRef.current;
      const colors = ["#ff6b6b","#ffa502","#ff7f50","#ff6b81","#ff9ff3"];

      for (let i=0;i<60;i++) {

        const angle = Math.random()*Math.PI*2;
        const speed = 2 + Math.random()*4;

        particles.push({
          x: Math.random()*canvas.width,
          y: Math.random()*canvas.height*0.3,
          vx: Math.cos(angle)*speed,
          vy: Math.sin(angle)*speed,
          life: 80 + Math.random()*40,
          color: colors[Math.floor(Math.random()*colors.length)]
        });

      }

    },1200);

    const animate = () => {

      ctx.fillStyle = "rgba(15,12,41,0.2)";
      ctx.fillRect(0,0,canvas.width,canvas.height);

      const particles = particlesRef.current;

      for (let i = particles.length-1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x,p.y,3,0,Math.PI*2);
        ctx.fill();

        if (p.life <= 0) particles.splice(i,1);

      }

      animationRef.current = requestAnimationFrame(animate);

    };

    animate();

    return () => {

      clearInterval(interval);
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize",resizeCanvas);

    };

  },[mainVisible]);

  /* --------------------------
     CONFETTI
  --------------------------- */

  useEffect(() => {

    if (!mainVisible) return;

    const container = confettiRef.current;
    container.innerHTML = "";

    for (let i=0;i<150;i++) {

      const conf = document.createElement("div");

      conf.className="conf";
      conf.style.left = Math.random()*100 + "%";
      conf.style.animationDuration = 4 + Math.random()*6 + "s";

      container.appendChild(conf);

    }

  },[mainVisible]);

  /* --------------------------
     MUSIC AUTOPLAY
  --------------------------- */

  useEffect(() => {

    const startMusic = () => {

      if (audioRef.current)
        audioRef.current.play().catch(()=>{});

    };

    document.addEventListener("click",startMusic,{once:true});

    return () => document.removeEventListener("click",startMusic);

  },[]);

  /* --------------------------
     OPEN GIFT
  --------------------------- */

  const openGift = () => {

    if (giftOpen) return;

    setGiftOpen(true);

    setTimeout(()=>{
      setHideGift(true);
    },800);

    setTimeout(()=>{
      setCakeVisible(true);
    },1300);

    setTimeout(()=>{

      const container = confettiRef.current;

      for (let i=0;i<25;i++){

        const conf = document.createElement("div");

        conf.className="conf";
        conf.style.left = 50 + (Math.random()-0.5)*50 + "%";
        conf.style.top = "50%";
        conf.style.animation = "fall 2s linear forwards";

        container.appendChild(conf);

        setTimeout(()=>conf.remove(),2000);

      }

    },1200);

  };

  return (

    <>

      <audio ref={audioRef} autoPlay loop playsInline>
        <source src="/birthday.mp3" type="audio/mpeg"/>
      </audio>

      <div className="birthday-rain"></div>

      {introVisible && (
        <div id="intro">
          <h1>
            {typingText}
            <span className="cursor">|</span>
          </h1>
        </div>
      )}

      <canvas ref={canvasRef} id="fireworks"></canvas>

      {mainVisible && (

        <div id="mainPage">

          <h1 className="title">🎉 Happy Birthday Sister Khaoula Zahoum🎉</h1>

          <div
            className={`gift ${giftOpen ? "open" : ""} ${hideGift ? "hide" : ""}`}
            onClick={openGift}
          >

            <div className="gift-lid"></div>

            <div className="gift-box">
              <div className="ribbon-vertical"></div>
              <div className="ribbon-horizontal"></div>
            </div>

          </div>

          {cakeVisible && (

            <div className="cake">

              <div className="plate"></div>
              <div className="layer layer-bottom"></div>
              <div className="layer layer-middle"></div>
              <div className="layer layer-top"></div>
              <div className="icing"></div>

              <div className="candles">
                <div className="candle"></div>
                <div className="candle"></div>
                <div className="candle"></div>
              </div>

            </div>

          )}

        </div>

      )}

      <div ref={confettiRef} className="confetti"></div>

      <div className="music-hint">🎵 Birthday music playing 🎵</div>

    </>

  );

};

export default App;