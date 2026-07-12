<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-4">
        <Header />
        <slot />
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-3">
        <Footer />
      </div>
    </div> -->
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
</script>

<style >
@import url('https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

html, body {
  background: #fff url('~/assets/img/bg.webp') no-repeat center bottom fixed;
  background-size: cover;
  font-family: "Quicksand", sans-serif;
}
.quicksand {
  font-family: "Quicksand", sans-serif;
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
.shadow-lg {
  box-shadow: 0.5rem 0.5rem 0 #000000 !important;
}
.card {
  border-radius: 32px !important;
  corner-shape: squircle;
  border: 2.5px solid #212529 !important;
  box-shadow: 0.4rem 0.4rem 0 #000 !important;
}
.btn {
  font-weight: 600;
  transition: all 0.1s ease-in-out;
  /*border: 1.9px solid #000000;*/
  border-radius: 32px !important;
  corner-shape: squircle;
  box-shadow: 0.19rem 0.19rem 0 #000000 !important;
}
.btn:hover {
  transform: translate(2px,2px);
  border: 1.9px solid transparent;
  box-shadow: none !important;
}
.btn:disabled {
  border: 1.9px solid #000000;
  box-shadow: none !important;
  color: #bababa;
}
.form {
  font-weight: 550;
  border: 2.5px solid #000000;
  border-radius: 32px !important;
  corner-shape: squircle;
  box-shadow: 0.19rem 0.19rem 0 #000000 !important;
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
  color: #000;
  background-color: #bababa !important;
}
.btn-warning:disabled {
  color: #000;
  background-color: #bababa !important;
}
.btn-danger, .btn-danger:hover,
.bg-danger, .alert-danger {
  background-color: rgb(255, 99, 132) !important;
  color: #000;
}
.btn-warning, .btn-warning:hover,
.bg-warning, .alert-warning {
  background-color: #fafa96 !important;
  color: #000;
}
label {
  color: #030303;
  font-size: 1.1em;
  font-weight: 600;
  letter-spacing: .05em;
  margin-bottom: .3em;
}
a.link-footer {
  text-decoration: none;
  color: inherit;
  transition: all .1s ease-in-out;
  padding-bottom: .01rem;
}
a.link-footer:hover {
  border-bottom: 1px solid #777777
}
.hand-cursor {
  cursor: pointer;
}
table {
  font-size: medium;
}
table thead {
  font-size: medium;
}
table th {
  background-color: #000 !important;
  color: #fff;
}

.bg-dark, .text-bg-dark {
  background-color: #212529 !important;
}

.border-dark {
  border-color: #212529 !important;
}
.alert {
  border-radius: 32px !important;
  corner-shape: squircle;
  border-width: 2px;
  border: 2px solid #212529 !important;
}
.smallest {
  font-size: .8em;
}
</style>
