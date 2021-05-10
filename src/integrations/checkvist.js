clockifyButton.render(
    '.task.leafItem > .coreDiv:not(.task_closed):not(.clockify)',
    { observe: true },
    function (coreDiv) {
        const task = coreDiv.parentElement;
        const taskText = task ? $('.userContent', task).textContent.trim() : '';

        const parentTask = task.parentElement ? task.parentElement.parentElement : null;
        const projectText = parentTask ? $('.userContent', parentTask).textContent.trim() : '';

        const link = clockifyButton.createButton({
            description: taskText,
            projectName: projectText,
            taskName: taskText,
            small: true
        });
        link.style.float = 'right';
        link.style.position = 'relative';
        link.style.bottom = '-2px';
        link.style.right = '7px';
        link.style.zIndex = '15';

        const anchor = $('span.editable', coreDiv);
        anchor.appendChild(link);
    }
);