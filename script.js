"use strict";
//? selector
const ekleFormu = document.getElementById("ekle-formu");
const gelirInput = document.getElementById("gelir-input");
const ekleBtn = document.getElementById("ekle-btn");
//?sonuc tablosu
const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");

//?harcama formu
const harcamaFormu = document.getElementById("harcama-formu");
const harcamaAlaniInput = document.getElementById("harcama-alani");
const tarihInput = document.getElementById("tarih");
const miktarInput = document.getElementById("miktar");

//?harcama tablosu
const harcamaBody = document.getElementById("harcama-body");
const temizleBtn = document.getElementById("temizle-btn");
//?variables
let gelirler = "";
let harcamaListesi = [];
//?events

ekleFormu.addEventListener("submit", (e) => {
  gelirler = Number(gelirler) + Number(gelirInput.value);
  e.preventDefault();
  ekleFormu.reset();
  localStorage.setItem("gelirler", gelirler);
  hesaplaVeGuncelle();
});

window.addEventListener("load", () => {
  gelirler = Number(localStorage.getItem("gelirler"));

  harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || [];
  harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama));
  console.log(harcamaListesi);

  tarihInput.valueAsDate = new Date();
  hesaplaVeGuncelle();
});

harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault();

  const yeniHarcama = {
    id: new Date().getTime(),
    tarih: tarihInput.value,
    alan: harcamaAlaniInput.value,
    miktar: miktarInput.value,
  };

  harcamaListesi.push(yeniHarcama);

  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  harcamayiDomaYaz(yeniHarcama);
  hesaplaVeGuncelle();
  harcamaFormu.reset();
  tarihInput.valueAsDate = new Date();
  console.log(yeniHarcama);
});

//?function
const hesaplaVeGuncelle = () => {
  const giderler = harcamaListesi.reduce(
    (toplam, harcama) => toplam + Number(harcama.miktar),
    0
  );
  gelirinizTd.innerText = gelirler;
  giderinizTd.innerText = giderler;
  kalanTd.innerText = gelirler - giderler;
};
const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
  harcamaBody.innerHTML += `
<tr>
    <td class="col col-1">${tarih}</td>
    <td class="col col-2">${alan}</td>
    <td class="col col-3">${miktar}</td>
    <td class="col col-4" ><i id=${id} class="fa-solid fa-trash-can"></i></td>
</tr>
`;
};

harcamaBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove();
    const id = e.target.id;
    console.log(id);

    harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != id);
    console.log(harcamaListesi);

    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  }
  hesaplaVeGuncelle();
});

temizleBtn.addEventListener("click", () => {
  if (confirm("silmek istedigine emin misin?")) {
    harcamaListesi = [];
    gelirler = 0;
    localStorage.clear();
    harcamaBody.innerHTML = "";
    hesaplaVeGuncelle();
  }
});
