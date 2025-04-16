(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  const swiper = new Swiper('.swiper', {
    loop: false,
    grabCursor: true,
    spaceBetween: 20,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    breakpoints: {
      0: {
        slidesPerView: 4
      },
      768: {
        slidesPerView: 5
      },
      1024: {
        slidesPerView: 8
      }
    }
  
  });

// With Tax toggle button
  let taxSwitch = document.getElementById('switchCheckDefault');
  taxSwitch.addEventListener("click", () =>{
      let taxInfo = document.getElementsByClassName('tax-info');
      for(info of taxInfo){
          if(info.style.display != "inline"){
              info.style.display = "inline";
          }
          else{
              info.style.display = "none";
          }
      }
  })