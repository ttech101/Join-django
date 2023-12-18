let draggedElement;

/**
 * This function creates a task on the borad page
 * 
 * @param {number} id index for task
 * @param {string} category 
 * @param {string} headline 
 * @param {string} text 
 * @param {string} priority_img 
 * @returns finished task
 */
function createBoardTasks(id, category, headline, text, priority_img) {
    return `<div onclick="loadBoardCard(${id})" id="${id}" draggable="true" ondragstart="startDragging(${id})" class="board_fbc board_note" >
        <div class="board_task_headline" style="background-color: ${category.color};">${category.text}
        </div>
        <div class="board_task_header">${headline}
        </div>
        <div class="board_task_text">${text}
        </div>
        <div class="board_fbsbc" id="task_subtask${id}">
            <div class="board_task_progess_empty">
                <div id="progress-bar-25" class="board_task_progess" role="progressbar" aria-valuenow="75"
                    aria-valuemin="0" aria-valuemax="100" style="width: 50%;">
                </div>
            </div>
            <div class="board_task_progess_text">
            1/2 Subtasks
            </div>
        </div>
        <div class="board_fbsbc board_footerline">
            <div id="task_user${id}" class="board_fbfb board_task_name_box">
            </div>
            <div class="board_task_prio"><img src="${priority_img}" alt="">
            </div>
        </div>
    </div>`;
}


/**
 * This function creates the individual users of the respective task
 * 
 * @param {string} color 
 * @param {string} name 
 * @returns return user
 */
function createBoardUsers(color, name) {
    return `
    <div class="board_task_name board_fbcc" style="background: ${color};">${name}
    </div>`;
}


/**
 * This function creates the display for the subtasks
 * 
 * @param {number} taskcompleted 
 * @param {number} taskall 
 * @param {number} percent 
 * @returns return the subtask
 */
function createBoardSubtasks(taskcompleted, taskall, percent) {
    return `
    <div class="board_task_progess_empty">
        <div id="progress-bar-25" class="board_task_progess" role="progressbar" aria-valuenow="75"
        aria-valuemin="0" aria-valuemax="100" style="width: ${percent}%;">
        </div>
    </div>
    <div class="board_task_progess_text">
        ${taskcompleted}/${taskall} Subtasks
    </div>`;
}

/**
 * This function creates the board map that was selected
 * 
 * @param {number} id 
 * @param {string} story 
 * @param {string} story_bg 
 * @param {string} headline 
 * @param {string} text 
 * @param {date} date 
 * @param {string} priority 
 * @param {string} priority_img 
 * @returns return boardcard
 */
function createBoradCard(id, story, story_bg, headline, text, date, priority, priority_img) {
    return `
    <div class="board_detail_box board_fbcc" onclick="closeBoardCard()" >
    <div id="board_detail_card" class="board_detail_card" onclick="notClose(event), closeAssignedToField()">
        <div class="board_fbsbc">
            <div id="Card_story${id}" class="board_detail_header board_fbcc"  style="background-color: ${story_bg};">${story}</div>
            <div class="board_detail_fixed_close">
            <img onclick="stopClosing(event), closeBoardCard()" src="../img/Close.svg" alt="">
        </div></div>
        <div id="board_detail_box_content">
        <div class="board_detail_headline">${headline}
        </div>
        <div class="board_detail_text">${text}
        </div>
        <div class="board_fbfb board_detail_date_prio">
            <div style="width: 130px;">Due date:
            </div>
            <div>${date}
            </div>
        </div>
        <div class="board_fbfb board_detail_date_prio">
            <div style="width: 130px;">Priority:
            </div>
            <div class="board_fbcc">${priority}<img src="${priority_img}" alt="">
            </div>
        </div>
        <div id="board-card-users${id}" class="board_dfcfsco board_detail_date_prio">Assigned To:
            <div class="board_dfcb" style="margin-top: 20px;margin-left: 25px;">
                <div class="board_task_name board_fbcc" style="background: green;">TT
                </div>
                <span class="board_detail_name"> Tony Tech</span>
            </div>
            <div class="board_dfcb" style="margin-top: 20px;margin-left: 25px;">
                <div class="board_task_name board_fbcc" style="background: green;">TT
                </div>
                <span class="board_detail_name"> Tony Tech</span>
            </div>
        </div>
        <div id="board-card-subtasks${id}" class="board_dfcfsco board_detail_date_prio">Subtasks
            <div class="board_dfcb" style="margin-top: 20px;margin-left: 5px;">
                <img class="board_fbcc" src="../img/Check button.svg" alt="">
                <span class="board_detail_subtasks"> Implement Recipe Recommendation</span>
            </div>
            <div class="board_dfcb" style="margin-top: 20px;margin-left: 5px;">
                <img class="board_fbcc" src="../img/Check button none.svg" alt="">
                <span class="board_detail_subtasks"> Implement Recipe Recommendation</span>
            </div>
            </div>
            </div>
        <div class="board_dfec board_detail_del_edit" style="margin-top: 30px;">
            <div id="board_card_bt_delete" onclick="deleteTask(${id})" class="board_dfcb"><img  src="../img/delete.svg" alt="">Delete
                <img style="cursor: default;" src="../img/stroked_vertically.svg" alt="">
            </div>
            <div id="board_card_bt_edit" onclick="editTask(${id});loadCheckedAssist(${id})" class="board_dfcb"><img  src="../img/edit.svg" alt="">Edit</div>
        </div>
    </div>
</div>
    `;
}

/**
 * This function creates the respective user in the board card
 * 
 * @param {string} first_name 
 * @param {string} user 
 * @param {string} color 
 * @returns return boardcard user
 */
function createBoardCardUsers(first_name, user, color) {
    return `
    <div class="board_dfcb" style="margin-top: 20px;margin-left: 25px;">
    <div class="board_task_name board_fbcc" style="background: ${color};">${user}
    </div>
        <span class="board_detail_name">${first_name}</span>
    </div>`;
}

/**
 * This function creates the subtasks contained in the board card
 * 
 * @param {number} id 
 * @param {number} i 
 * @param {string} status 
 * @param {string} text 
 * @param {string} img 
 * @returns return boardcard subtask
 */
function createBoardCardSubtaks(id, i, status, text, img) {
    return `
    <div id="completed${id}-${i}" class=" board_detail_subtasks board_dfcb" style="margin-top: 20px;margin-left: 5px;">
    <img onclick="toggelSubtaskCompleted(${id},${i},${status})" class="board_fbcc" src="${img}" alt="">
    <span>${text}</span>
</div>`;
}