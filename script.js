let previousSectionId = 'omoi';

// 1. 현재 페이지의 언어 판별 (<html lang="en"> 확인)
const isEnglish = document.documentElement.lang === 'en';

// 2. 일어 / 영어 메뉴 데이터 통합
const singleMenuData = {
  food: isEnglish ? [
    { name: 'Edomae Nigiri Selection', price: 'Market Price', desc: 'Seasonal wild fish meticulously hand-pressed using traditional Edomae techniques.' },
    { name: 'Signature ENN Roll', price: '¥3,800', desc: 'Luxurious roll filled with sea urchin (Uni), house-cured salmon roe, and selected bluefin tuna.' },
    { name: 'Snow Crab, Uni & Caviar', price: '¥4,500', desc: 'Sweet snow crab served with rich sea urchin and caviar in a special small dish.' },
    { name: 'Kinki Fish Shabu-Shabu', price: '¥5,200', desc: 'Premium Hokkaido Kinki (thorny head) fish prepared in a delicate dashi hot pot broth.' }
  ] : [
    { name: '江戸前仕立て 握り各種', price: '時価', desc: '旬の天然魚を伝統の江戸前技法で一貫一貫丁寧に握ります。' },
    { name: '極みのえんロール', price: '¥3,800', desc: '馬糞雲丹、自家製いくら、厳選本マグロを贅沢に巻き上げた名物逸品巻き。' },
    { name: 'ズワイ蟹と雲丹とキャビア', price: '¥4,500', desc: '甘み豊かなズワイ蟹に濃厚な雲丹とキャビアを添えた特別小鉢。' },
    { name: '吉次のしゃぶしゃぶ', price: '¥5,200', desc: '北海道産・高級魚吉次（キンキ）の豊かな脂を贅沢に出汁しゃぶで。' }
  ],
  drink: isEnglish ? [
    { name: 'Hitakami Junmai Daiginjo "Gourd"', price: 'Market Price', desc: 'Miyagi Ishinomaki’s specialty sake crafted specifically for sushi. Elegant gourd bottle.' },
    { name: 'DATE SEVEN Premium Sake', price: 'Market Price', desc: 'An exclusive annual collaboration sake brewed jointly by 7 renowned Miyagi breweries.' },
    { name: 'Jikon Junmai Daiginjo', price: 'From ¥2,200', desc: 'Rare premium sake with a fresh fruity aroma and exceptionally crisp finish.' },
    { name: 'Isojiman / Zaku Satoshi', price: 'From ¥1,800', desc: 'Acclaimed top-tier sakes that pair seamlessly with sushi fat and seasoned rice.' }
  ] : [
    { name: '日高見（ひたかみ）純米大吟醸 瓢箪', price: '時価', desc: '宮城・石巻の平孝酒造が誇る鮨専用酒。美しい瓢箪ボトルと極上の切れ味。' },
    { name: 'DATE SEVEN（デートセブン）', price: '時価', desc: '宮城県の蔵元7社が合同で醸す、年に一度の限定プレミアム日本酒。' },
    { name: '而今（じこん）純米大吟醸', price: '¥2,200 〜', desc: '入手困難とされる銘酒。果実のような華やかな香りと澄んだ透明感。' },
    { name: '磯自慢 / 作（ざく）智', price: '¥1,800 〜', desc: 'ミシュラン掲載店で愛される最高峰。鮨の脂と酢飯の酸味に完璧に寄り添う一献。' }
  ]
};

function enterLobbyFromStart() {
  document.getElementById('start-page').classList.add('is-hidden');
  document.getElementById('lobby-screen').classList.remove('is-closed');
}

function goToStartPage() {
  document.getElementById('start-page').classList.remove('is-hidden');
  document.getElementById('lobby-screen').classList.add('is-closed');
}

function openLobby() {
  document.getElementById('lobby-screen').classList.remove('is-closed');
}

function closeLobby() {
  document.getElementById('lobby-screen').classList.add('is-closed');
}

// 스크롤 시 어두운 배경(omoi, waza) 진입을 감지하여 헤더 밝기 조절
function updateHeaderTheme(container) {
  const pageHeader = document.querySelector('.page-header');
  if (!pageHeader || !container) return;

  const currentSectionId = container.id;

  if (currentSectionId === 'omoi' || currentSectionId === 'waza') {
    const darkWrapper = container.querySelector('.omoi-main-wrapper, .waza-main-wrapper');
    if (darkWrapper) {
      const rect = darkWrapper.getBoundingClientRect();
      if (rect.top <= 80) {
        pageHeader.classList.add('is-dark');
      } else {
        pageHeader.classList.remove('is-dark');
      }
    }
  } else {
    pageHeader.classList.remove('is-dark');
  }
}

function navigateToSection(sectionId) {
  previousSectionId = sectionId;
  const allSections = document.querySelectorAll('.section-block');
  
  allSections.forEach(sec => {
    sec.classList.remove('is-active');
    sec.scrollTop = 0;
  });

  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    targetElement.classList.add('is-active');
    initIntersectionObserver(targetElement);
    
    targetElement.onscroll = function () {
      updateHeaderTheme(targetElement);
    };

    updateHeaderTheme(targetElement);

    if (sectionId === 'menu') {
      renderSingleMenu('food');
    }
  }

  document.getElementById('lobby-screen').classList.add('is-closed');
}

function switchCategory(evt, cat) {
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  if (evt && evt.target) {
    evt.target.classList.add('active');
  }
  renderSingleMenu(cat);
}

function renderSingleMenu(cat) {
  const listContainer = document.getElementById('singleMenuList');
  if (!listContainer) return;

  const items = singleMenuData[cat] || [];
  listContainer.innerHTML = items.map(item => `
    <div class="course-item">
      <div class="course-main-row">
        <h3 class="course-name">${item.name}</h3>
        <div class="course-price">${item.price}</div>
      </div>
      <div class="course-desc-box">
        ${item.desc}
      </div>
    </div>
  `).join('');
}

function initIntersectionObserver(container) {
  const reveals = container.querySelectorAll('.reveal');
  reveals.forEach(el => el.classList.remove('is-visible'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    root: container,
    threshold: 0.05
  });

  reveals.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", function () {
  renderSingleMenu('food');
  const activeSection = document.querySelector('.section-block.is-active');
  if (activeSection) {
    initIntersectionObserver(activeSection);
  }
});

// 달력(flatpickr) 설정 - 영어 페이지면 영어, 아니면 일본어로 자동 설정
flatpickr("#customDatePicker", {
  locale: isEnglish ? "default" : "ja",
  dateFormat: "Y/m/d",
  minDate: "today",
  disableMobile: "true"
});