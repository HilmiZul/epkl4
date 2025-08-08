<template>
  <div class="container">
    <Header />

    <slot />

    <!-- <div class="row">
      <div class="col-3">
        <Footer />
      </div>
    </div> -->
  </div>
</template>

<style >
@import url('https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap');

@font-face {
  font-family: 'Romana BT';
  src: url('~/assets/font/RomanaB.ttf');
}
@font-face {
  font-family: 'Metropolis';
  src: url('~/assets/font/Metropolis-Regular.otf');
}
html, body {
  background: #f5fff2 url('~/assets/img/bg-cloud.png') no-repeat center bottom fixed;
  background-size: cover;
  font-family: "Public Sans", sans-serif;
}
.public-sans {
  font-family: "Public Sans", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}
.lexend-mega {
  font-family: "Lexend Mega", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.metropolis {
  font-family: 'Metropolis';
}
.romana {
  font-family: 'Romana BT';
}
.shadow-lg {
  box-shadow: 0.5rem 0.5rem 0 #000000 !important;
}
.card {
  border-radius: 0 !important;
  border: 1.9px solid #000000;
  box-shadow: 0.5rem 0.5rem 0 #000000 !important;
}
.btn {
  transition: all 0.2s ease-in-out;
  border: 1.9px solid #000000;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.btn:hover {
  transform: scale(0.97);
  border: 1.9px solid #000000;
  box-shadow: 0.1rem 0.1rem 0 #000000 !important;
}
.btn:disabled {
  border: 1.9px solid #000000;
  box-shadow: none !important;
}
.form {
  border: 1.9px solid #000000;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.form:focus {
  border-color: #000000;
}
button.btn-grey {
  background-color: #c1ccd5;
  border: none;
  color: #212c30;
}
button.btn-grey:hover {
  color: #f5fff2;
  background-color: #212c30;
}
.btn-success, .btn-success:hover,
.bg-success, .alert-success {
  background-color: #b5d2ad !important;
  color: #000;
}
.btn-success:disabled {
  color: #000
}
.btn-danger, .btn-danger:hover,
.bg-danger, .alert-danger {
  background-color: #ff7a5c !important;
  color: #000;
}
.btn-warning, .btn-warning:hover,
.bg-warning, .alert-warning {
  background-color: #fafa96 !important;
  color: #000;
}
</style>
