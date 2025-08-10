<template>
  <div class="container pb-5">
    <Header />
    <div class="row">
      <Navbar />
      <Nav />
      <div class="col">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
let isConfetti = ref(false)
const handleDataConfetti = (data) => {
  isConfetti.value = data
}
</script>

<style>
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
  /*background-color: #a0a0a0;*/
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
  box-shadow: 0.4rem 0.4rem 0 #000000 !important;
}
.card {
  border-radius: 0 !important;
  border: 2px solid #000000;
  box-shadow: 0.4rem 0.4rem 0 #000000 !important;
}
.alert {
  border-radius: 0 !important;
  border-width: 2px;
  border: 2px solid #000 !important;
}
.btn {
  transition: all 0.1s ease-in-out;
  border: 1.9px solid #000000;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.btn:hover {
  transform: translate(2px,2px);
  border: 1.9px solid #000000;
  box-shadow: none !important;
}
.btn:disabled {
  border: 1.9px solid #000000;
  box-shadow: none !important;
  color: #000 !important;
  background-color: #bababa !important;
}
.form {
  border: 1.9px solid #000000;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.form:focus {
  border-color: #000000;
}
label {

  font-weight: 700;
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
.btn-danger, .btn-danger:hover,
.bg-danger, .alert-danger {
  background-color: #ff6b6b !important;
  color: #000 !important;
}
.btn-warning, .btn-warning:hover,
.bg-warning, .alert-warning {
  background-color: #fafa96 !important;
  color: #000;
}
.btn-info, .btn-info:hover,
.bg-info, .alert-info {
  background-color: #87ceeb !important;
  color: #000;
}
.border-danger {
  border-color: #ff6b6b !important;
}
.text-danger {
  color: #ff6b6b !important;
}
.text-info {
  color: rgb(54, 162, 235) !important;
}
table {
  font-size: small;
}
table thead {
  font-size: medium;
}
table th {
  background-color: #000 !important;
  color: #fff;
}
.table-responsive {
  height: 400px;
  overflow-x: auto;
  overflow-y: auto;
  border: 2px solid #000
}
.table-responsive th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}
a.link {
  text-decoration: none;
  color: #000;
  border-bottom: 2px dashed #c1ccd5;
  transition: all .2s ease-in-out;
  padding-bottom: .2rem;
}
a.link:hover {
  color: #000;
  border-bottom-color: #000;
}
input[type="checkbox"]:checked {
  transform: scale(1.3);
  height: 1.2em;
  border: 2px solid #000 !important;
  background-color: #23b05b !important;
  color: #23b05b !important;
  margin-right: .8em;
  box-shadow: none;
}
input[type="checkbox"]:focus {
  color:#23b05b;
  box-shadow: none;
  height: 1.2em;
}
input[type="checkbox"]:not(:checked) {
  transform: scale(1.3);
  height: 1.2em;
  border: 2px solid #bababa !important;
  margin-right: .8em;
  box-shadow: none;
}
.text-grey {
  color: #4f4f4f;
}
.bg-grey {
  background-color: #bababa;
}
.badge {
  font-size: small;
}
.hand-cursor {
  cursor: pointer;
}
.label-berkas {
  border: 2px dashed #000 !important;
}
</style>
