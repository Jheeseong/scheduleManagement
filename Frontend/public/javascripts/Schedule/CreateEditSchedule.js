const body = document.querySelector('body')
const listModal = document.querySelector('.modal_schedule--list')
const editModal = document.querySelector('.modal_schedule--edit')
const mapModal = document.getElementsByClassName('modal_schedule_body')[2];

/* 배경 클릭 시 모달창 닫는 이벤트리스너 */
listModal.addEventListener('mousedown', closeModal)
editModal.addEventListener('mousedown', closeModal)

/* 모달창 닫는 함수 */
function closeModal(event){
    if(event.currentTarget == event.target){
        listModal.classList.remove('show');
        editModal.classList.remove('show');

        /* 체크박스 및 카카오맵 모달 해제 */
        document.getElementById('addrCheckbox').checked = false;
        mapModal.classList.remove('show');
    }
}

function openListModal() {
    listModal.classList.add('show')
    if (listModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}

function openEditModal() {
    listModal.classList.remove('show');
    editModal.classList.add('show')
    if (editModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}

function addrToggle() {
    addrChecked = document.getElementById('addrCheckbox').checked;
    if(addrChecked){
        mapModal.classList.add('show');
    }
    else{
        mapModal.classList.remove('show');
    }
    if(mapModal.classList.contains('show')){
        map.relayout();
    }
}

function saveSchedule(userId) {
    const arrayTag = [];
    const schedules = {
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        title: document.getElementById('scheduleName').value,
        content: document.getElementById('scheduleContent').value,
        priority: document.getElementById('schedulePriority').value,
        address: document.getElementById('addrInput').value,
        tagInfo: arrayTag,
        userInfo : userId
    }
    $.ajax({
        type: 'POST',
        data: schedules,
        url: 'schedule/create',
        dataType: "json",

        success: function (res) {

        },
        error: function (err) {

        }
    })
}