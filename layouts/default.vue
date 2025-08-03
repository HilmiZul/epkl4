<template>
  <div class="container-fluid pb-5">
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

<style>
@font-face {
  font-family: 'Romana BT';
  src: url('~/assets/font/RomanaB.ttf');
}
@font-face {
  font-family: 'Metropolis';
  src: url('~/assets/font/Metropolis-Regular.otf');
}
html, body {
  background-color: #f5fff2;
  font-family: 'Metropolis';
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
.alert {
  border-radius: 0 !important;
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
table {
  font-size: small;
}
.table-responsive {
  height: 570px;
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
  border-bottom: 3px dashed #c1ccd5;
  transition: all .2s ease-in-out;
  padding-bottom: .2rem;
}
a.link:hover {
  color: #000;
  border-bottom-color: #000;
}
input[type="checkbox"]:checked {
  transform: scale(1.3);
  border-color: #23b05b !important;
  background-color: #23b05b !important;
  color: #23b05b !important;
  margin-right: .8em;
  box-shadow: none;
}
input[type="checkbox"]:focus {
  color:#23b05b;
  box-shadow: none;
}
input[type="checkbox"]:not(:checked) {
  transform: scale(1.3);
  border-color: #bababa !important;
  margin-right: .8em;
  box-shadow: none;
}
</style>
