let previousSectionId = 'omoi';

const singleMenuData = {
  food: [
    { name: '江戸前仕立て 握り各種', price: '時価', desc: '旬の天然魚を伝統の江戸前技法で一貫一貫丁寧に握ります。' },
    { name: '極みのえんロール', price: '¥3,800', desc: '馬糞雲丹、自家製いくら、厳選本マグロを贅沢に巻き上げた名物逸品巻き。' },
    { name: 'ズワイ蟹と雲丹とキャビア', price: '¥4,500', desc: '甘み豊かなズワイ蟹に濃厚な雲丹とキャビアを添えた特別小鉢。' },
    { name: '吉次のしゃぶしゃぶ', price: '¥5,200', desc: '北海道産・高級魚吉次（キンキ）の豊かな脂を贅沢に出汁しゃぶで。' }
  ],
  drink: [
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

    if (sectionId === 'menu') {
      renderSingleMenu('food');
    }
  }

  document.getElementById('lobby-screen').classList.add('is-closed');
}

// 어두운 영역 감지하여 헤더 테마 변경하는 함수
function updateHeaderTheme(container) {
  const pageHeader = document.querySelector('.page-header');
  if (!pageHeader || !container) return;

  const currentSectionId = container.id;

  // omoi 또는 waza 섹션일 때 스크롤 위치 감지
  if (currentSectionId === 'omoi' || currentSectionId === 'waza') {
    const darkWrapper = container.querySelector('.omoi-main-wrapper, .waza-main-wrapper');
    if (darkWrapper) {
      // 어두운 배경 요소의 위쪽 위치 측정
      const rect = darkWrapper.getBoundingClientRect();
      
      // 헤더 영역(상단 80px 기준)에 어두운 배경이 도착했을 때만 is-dark 클래스 추가
      if (rect.top <= 80) {
        pageHeader.classList.add('is-dark');
      } else {
        pageHeader.classList.remove('is-dark');
      }
    }
  } else {
    // 그 외 섹션은 항상 기본(금색/검은색) 유지
    pageHeader.classList.remove('is-dark');
  }
}

// 섹션 전환 함수 수정
function navigateToSection(sectionId) {
  previousSectionId = sectionId;
  const allSections = document.querySelectorAll('.section-block');
  
  allSections.forEach(sec => {
    sec.classList.remove('is-active');
    sec.scrollTop = 0; // 스크롤 위치 초기화
  });

  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    targetElement.classList.add('is-active');
    initIntersectionObserver(targetElement);
    
    // 섹션 내 스크롤 이벤트 등록 (어두운 영역 실시간 감지)
    targetElement.onscroll = function () {
      updateHeaderTheme(targetElement);
    };

    updateHeaderTheme(targetElement); // 처음 진입 시 상태 체크

    if (sectionId === 'menu') {
      renderSingleMenu('food');
    }
  }

  document.getElementById('lobby-screen').classList.add('is-closed');
}

// 스크롤 시에도 어두운 영역 진입 감지 (omoi, waza 내 스크롤 대응)
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
  
  // 섹션 진입 시 헤더 색상 반영
  updateHeaderTheme(container);
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

flatpickr("#customDatePicker", {
  locale: "ja",
  dateFormat: "Y/m/d",
  minDate: "today",
  disableMobile: "true"
});