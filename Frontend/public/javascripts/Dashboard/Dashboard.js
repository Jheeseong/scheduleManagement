/**
 * 담당자 : 정희성 배도훈
 * 함수 설명 : 페이지 실행 시 카테고리, 일정, 활동 로그, 메모 정보 바인딩 함수
 * 주요 기능 : 페이지 실행 시 함수들 실행 기능
 */

let scheduleCheck = false;
document.addEventListener('DOMContentLoaded', function () {
    findLog(1)
    categoryList()
    findScheduleList(scheduleCheck);
    findMemoList();
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 목록을 조회하는 함수
 * 주요 기능 : 메모 목록을 조회
 */
function findMemoList() {
    /** 메모 영역을 목록 형태로 변환 */
    showMemoList()
    /** 메모 목록 조회 API 호출 */
    $.ajax({
        type: 'POST',
        url: 'memo/findMemoList/',
        dataType: "json",
        success: function (memos) {
            let memoList = document.querySelector('.memoList');
            memoList.innerHTML = '';
            /** 메모 개수만큼 요소를 생성하여 목록에 추가 */
            for (let i = 0; i < memos.memo.length; i++) {
                let memoRow = document.createElement('div');
                memoRow.classList.add('memoRow');
                memoRow.setAttribute('value', memos.memo[i]._id)
                memoRow.setAttribute('onclick', 'memoDetail(this)')
                memoRow.innerText = memos.memo[i].content;
                memoList.appendChild(memoRow)
            }

            /** 메모가 없으면 메시지 표시 */
            if(memos.memo.length == 0){
                let emptyMessageDiv = document.createElement('div');
                emptyMessageDiv.classList.add('emptyMessageDiv')
                emptyMessageDiv.innerText = '등록된 메모가 없습니다.'
                memoList.appendChild(emptyMessageDiv)
            }
        },
        error: function (err) {
            window.alert("등록된 메모가 없습니다")
            console.log(err)
        }
    })
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 상세 조회 함수
 * 주요 기능 : 메모 클릭 시 해당 메모의 내용을 조회
 */
function memoDetail(el){
    /** 요소의 value 속성에 저장된 id를 파라미터로 받아 상세 조회 API 호출 */
    let memoId = el.getAttribute('value')
    $.ajax({
        type: 'POST',
        url: 'memo/findMemoDetail/' + memoId,
        dataType: "json",
        success: function (result) {
            showMemoText(memoId, result.memo.content, result.memo.createDate, result.memo.updateDate)
        },
        error: function (err) {
            window.alert("메모를 찾지 못하였습니다.")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 영역을 목록 형태로 전환하는 함수
 * 주요 기능 : 메모 영역의 요소들을 목록 형태로 전환
 */
function showMemoList(){
    let notepad = document.querySelector('.notepad');
    let icons = document.querySelectorAll('.content--memo i.fa-chevron-left, .content--memo i.fa-check, .content--memo i.fa-trash')
    document.querySelector('.memoList').style.display = 'block';
    document.querySelector('.memoTextDiv').style.display = 'none';
    document.querySelector('.memoText').value = '';
    notepad.style.backgroundColor = 'inherit';
    notepad.style.boxShadow = 'none';
    icons.forEach(function (i) {
        i.style.display = 'none';
    })
    icons[2].setAttribute('onclick', 'saveMemo()')
    document.querySelector('.content--memo .fa-plus').style.display = 'inline-block';

    document.querySelector('.memoDateDiv').innerText = '';
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 영역을 글쓰기 형태로 전환하는 함수
 * 주요 기능 : 메모 영역의 요소들을 글쓰기 형태로 전환
 */
function showMemoText(id, content, createDate, updateDate){
    document.querySelector('.memoList').style.display = 'none';
    document.querySelector('.memoTextDiv').style.display = 'block';
    document.querySelector('.notepad').style.backgroundColor = '#FFF7D1';


    let selector;
    id ? selector = '.content--memo i.fa-chevron-left, .content--memo i.fa-check, .content--memo i.fa-trash' : selector = '.content--memo i.fa-chevron-left, .content--memo i.fa-check'

    let icons = document.querySelectorAll(selector)
    icons.forEach(function (i) {
        i.style.display = 'inline-block';
    })
    document.querySelector('.content--memo .fa-plus').style.display = 'none';

    if(id){
        icons[1].setAttribute('onclick', 'deleteMemo(\'' + id + '\')')
        icons[2].setAttribute('onclick', 'saveMemo(\'' + id + '\')')
        document.querySelector('.memoTextDiv textarea').value = content;

        document.querySelector('.memoDateDiv').innerText = '작성일 ' + createDate.replace('T', ' ').substring(0, 16)

        if(updateDate){
            document.querySelector('.memoDateDiv').innerText += ' 수정일 ' + updateDate.replace('T', ' ').substring(0, 16)
        }
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 작성한 메모를 저장(생성, 수정)하는 함수
 * 주요 기능 : 메모의 아이디 존재 시 해당 아이디의 메모를 수정하고, 존재하지 않을 시 새로운 메모 생성하는 기능
 */
function saveMemo(id) {
    let content = document.querySelector('.memoText').value
    let url;
    /** 아이디 유무에 따라 상이한 url로 API 통신 */
    id ? url = 'memo/updateMemo/' + id : url = 'memo/saveMemo/';
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            content: content,
        },
        dataType: "json",
        success: function (result) {
            findMemoList()
        },
        error: function (err) {
            console.log(err)
            alert(err)
        }
    })
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 선택한 메모를 삭제하는 함수
 * 주요 기능 : 삭제 버튼 클릭 시 선택한 메모를 삭제
 */
function deleteMemo(id){
    $.ajax({
        type: 'POST',
        url: 'memo/deleteMemo/' + id,
        dataType: "json",
        success: function (result) {
            findMemoList()
        },
        error: function (err) {
            console.log(err)
            alert(err)
        }
    })
}
