<template>
  <div class="container-fluid mb-3">
    <div class="row mt-3">
      <!-- <Header /> -->
      <Navbar />
      <Nav />
      <div class="col-lg-9">
        <slot />
      </div>
      <Footer class="footer-mobile-view" />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

html, body {
  background: #f5fff2 url('~/assets/img/bg.webp') no-repeat center bottom fixed;
  background-size: cover;
  /*background-color: #f5fff2;*/
  font-family: "Quicksand", sans-serif;
  font-weight: 500;
}
@media (min-width: 1400px) {
  .container-fluid {
    max-width: 1600px;
  }
}
.quicksand {
  font-family: "Quicksand", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}
.lexend-mega {
  font-family: "Lexend Mega", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.shadow-lg {
  box-shadow: 0.4rem 0.4rem 0 #000000 !important;
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
.alert {
  border-radius: 0 !important;
  border-width: 2px;
  border: 2px solid #000 !important;
}
.btn {
  font-weight: 600;
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
  font-weight: 550;
  border: 2.3px solid #000000;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.form:focus {
  border-color: #000000;
}
label {
  color: #030303;
  font-size: 1em;
  font-weight: 600;
  letter-spacing: .05em;
  margin-bottom: .3em;
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
  /*background-color: #ff6b6b !important;*/
  background-color: rgb(255, 99, 132) !important;
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
.bg-purple, .alert-purple, .btn-purple,
.btn-purple:hover {
  background-color: #a388ee !important;
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
  font-size: medium;
}
table thead {
  font-size: medium;
}
table th {
  background-color: #000 !important;
  color: #fff;
}
.table-responsive {
  height: 600px;
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
  color: inherit;
  /*border-bottom: 1.5px solid #a7a7a7;*/
  transition: all .1s ease-in-out;
  padding-bottom: .01rem;
}
a.link:hover {
  border-bottom: 1.5px solid #000 !important;
}
a.link-external {
  text-decoration: none;
  color: #000;
  border-bottom: 1.5px solid #a7a7a7;
  transition: all .1s ease-in-out;
  padding-bottom: .01rem;
}
a.link-external:hover {
  color: #000;
  border-bottom-color: #000 !important;
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
.smallest {
  font-size: .8em;
}
@media screen and (min-width: 992px) {
  .footer-mobile-view {
    display: none;
  }
}
.multiselect__tags {
  border: 2.3px solid #000000 !important;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.badge {
  border: 1.8px solid #000 !important
}
</style>
