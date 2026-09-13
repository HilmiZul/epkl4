export const useJjmToNumStudent = (jumlahSiswa, jjm) => {

  // const rombel = {
  //   rpl: 4,
  //   tkj: 4,
  //   tsm: 4,
  //   dkv: 2,
  //   toi: 1
  // }

  const ROMBEL = 15
  const JP_PKL = 46

  // let setRombel
  let koefisien = (ROMBEL * JP_PKL) / jumlahSiswa

  // if(jurusan == 'PPLG') {
  //   setRombel = rombel.rpl
  //   koefisien = (setRombel * JP_PKL) / jumlahSiswa
  // }
  // else if(jurusan == 'TJKT') {
  //   setRombel = rombel.tkj
  //   koefisien = (setRombel * JP_PKL) / jumlahSiswa
  // }
  // else if(jurusan == 'TSM') {
  //   setRombel = rombel.tsm
  //   koefisien = (setRombel * JP_PKL) / jumlahSiswa
  // }
  // else if(jurusan == 'DKV') {
  //   setRombel = rombel.dkv
  //   koefisien = (setRombel * JP_PKL) / jumlahSiswa
  // }
  // else if(jurusan == 'TOI') {
  //   setRombel = rombel.toi
  //   koefisien = (setRombel * JP_PKL) / jumlahSiswa
  // }

  let result = Math.round(jjm / koefisien) || 0

  return { result }
}
