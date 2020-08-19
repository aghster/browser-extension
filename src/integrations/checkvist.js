clockifyButton.render(
  '.task:not(.clockify)',
  { observe: true },
  element => {
    // parents is a function to get all parent nodes of a node
    // taken from https://stackoverflow.com/questions/8729193/how-to-get-all-parent-nodes-of-given-element-in-pure-javascript#comment85476662_8729274
    const parents = node => (
      node.parentElement
        ? parents(node.parentElement)
        : []
    ).concat([node]);

    // most information (e.g. tags) of a task is stored in its coreDiv
    // therefore parentTasks is a list of all parent tasks' coreDivs
    // the order is reversed so that closer parents come first
    const parentTasks = parents(element)
      .filter(parent => parent.matches('.task'))
      .map(parent => $('.coreDiv', parent))
      .reverse();
    const currentTask = parentTasks.shift();

    // only open tasks are clockified, also by default only leaf tasks are clockified,
    // however, clockification can be limited to branches tagged with #clockify or #clockifyAll:
    // - in a branch tagged with #clockify, only its leaf tasks are clockified
    // - in a branch tagged with #clockifyAll, all of its tasks are clockified
    // - in a branch tagged with #clockifyNone, none of its tasks are clockified
    let clockifyThis = !currentTask.matches('.task_closed') && element.matches('.leafItem');
    const clockifyTaggedOnly = $('.tag_clockify') || $('.tag_clockifyAll');
    if (clockifyTaggedOnly) {
      const taggedParent = parentTasks.find(parent => 
        parent.matches('.tag_clockify') ||
        parent.matches('.tag_clockifyAll') ||
        parent.matches('.tag_clockifyNone')
      ) || $('#header_span ~ .tag_clockify') || $('#header_span ~ .tag_clockifyAll') || currentTask;
      clockifyThis = !currentTask.matches('.task_closed') && (
        (taggedParent.matches('.tag_clockify') && element.matches('.leafItem')) ||
        taggedParent.matches('.tag_clockifyAll')
      )
    }
    if (!clockifyThis) {
      return;
    }

    // helper function to extract the task text of a task
    const getTaskText = elem => $('.userContent', elem).textContent.trim();

    const descriptionSelector = () => getTaskText(currentTask);

    // by default the project is the text of the immediate parent
    // however, if a parent is tagged with #clockifyProject, the project is the text of this parent
    const projectSelector = () => {
      const taggedParent = parentTasks.find(parent => parent.matches('.tag_clockifyProject')) || parentTasks[0];
      return getTaskText(taggedParent);
    };

    const tagsSelector = () => [...currentTask.classList]
      .filter(item => item.startsWith('tag_') && !item.startsWith('tag_clockify'))
      .map(item => item.substring(4));

    const link = clockifyButton.createButton({
      description: descriptionSelector,
      projectName: projectSelector,
      taskName: descriptionSelector,
      tagNames: tagsSelector,
      small: true,
    });

    link.style.float = 'right';
    link.style.position = 'relative';
    link.style.bottom = '-2px';
    link.style.right = '7px';
    link.style.zIndex = '15';

    $('span.editable', currentTask).appendChild(link);
  }
);
