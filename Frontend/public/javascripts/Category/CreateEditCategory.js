const categoryModal = document.querySelector('.modal_category--createEdit')
const userModal = document.getElementsByClassName('modal_category_body')[1];

/* 배경 클릭 시 모달창 닫는 이벤트리스너 */
categoryModal.addEventListener('mousedown', closeCategoryModal)

function closeCategoryModal(event){
    if(event.currentTarget == event.target){
        categoryModal.classList.remove('show');

        /* 체크박스 및 공유 유저 모달 해제 */
        document.getElementById('userCheckbox').checked = false;
        userModal.classList.remove('show');
    }
}

function openCategoryModal() {
    categoryModal.classList.add('show')
    if (categoryModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}

function addUserToggle() {
    let userChecked = document.getElementById('userCheckbox').checked;
    if(userChecked){
        userModal.classList.add('show');
    }
    else{
        userModal.classList.remove('show');
    }
}