// WOW 

new WOW().init();

//Menu abrir legal

// Importe a biblioteca scrollReveal (verifique como instalá-la)
const sr = ScrollReveal({
    reset: true, // Reinicia a animação ao sair e entrar na tela
    // Outros atributos personalizáveis
    
});

// Selecione os elementos que deseja animar
const elementsToAnimate = document.querySelectorAll(".counter-up");

// Aplique a animação aos elementos
sr.reveal(elementsToAnimate);

const tempo_intervalo = 10; //ms -> define a velocidade da animação
const tempo = 3000; //ms -> define o tempo total da animaçao

$('.counter-up').each(function() {  
  let count_to = parseInt($(this).data('countTo'));
  let intervalos = tempo / tempo_intervalo; //quantos passos de animação tem
  let incremento = count_to / intervalos; //quanto cada contador deve aumentar
  let valor = 0;
  let el = $(this);
  
  let timer = setInterval(function() {
    if (valor >= count_to){ //se já contou tudo tem de parar o timer
      valor = count_to;
      clearInterval(timer);
    }
    
    let texto = valor.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    el.text(texto);
    valor += incremento;      
  }, tempo_intervalo);
});

// Jogos

$('.catalogo').slick({
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3,
  responsive: [{
  breakpoint: 768,
    settings: {
      arrows: false,
      centerMode: true,
      centerPadding: '40px',
      slidesToShow: 3
    }
  },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
});