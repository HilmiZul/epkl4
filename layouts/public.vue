<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-3 mt-3">
        <Header />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 mb-5">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

html, body {
  background: #f5fff2 url('~/assets/img/bg.webp') no-repeat center bottom fixed;
  background-size: cover;
  font-family: "Quicksand", sans-serif;
  font-weight: 500;
}
.lexend-mega {
  font-family: "Lexend Mega", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.card {
  border-radius: 0 !important;
  border: 2.5px solid #000000 !important;
  box-shadow: 0.4rem 0.4rem 0 #000000 !important;
}
.card .card-header {
  border-bottom: 2.5px solid #000 !important;
  border-radius: 0 !important;
}
.bg-success {
  background-color: #b5d2ad !important;
  color: #000;
}
.bg-danger, .btn-danger {
  background-color: rgb(255, 99, 132) !important;
  color: #000 !important;
}
.btn-info {
  background-color: #87ceeb !important;
  color: #000;
}
.text-danger {
  color: rgb(255, 99, 132) !important;
}
.text-info {
  color: #87ceeb !important;
}
a.link {
  text-decoration: none;
  color: inherit;
  transition: all .1s ease-in-out;
  padding-bottom: .01rem;
}
.btn {
  font-weight: 600;
  transition: all 0.1s ease-in-out;
  /*border: 1.9px solid #000000;*/
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.btn:hover {
  transform: translate(2px,2px);

  box-shadow: none !important;
}
table th {
  background-color: #000 !important;
  color: #fff;
}
</style>
