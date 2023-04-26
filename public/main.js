const depositBttn = document.querySelector('#deposit')
const withdrawlBttn = document.querySelector('#withdrawl')
const inputAmount = document.querySelector('#inputAmount')
const inputComment = document.querySelector('#inputComment')
const TrashBttns = document.querySelectorAll('.ph-trash')
const editBttns = document.querySelectorAll('.ph-pencil-simple-line')
const saveBttns = document.querySelectorAll('.ph-floppy-disk')
const editInputs = document.querySelectorAll('.editComment')

const addMoney = () => {
  // e.preventDefault()
  fetch('transactions', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'deposit',
      amount: + (inputAmount.value), //we parseInt the value
      comment: inputComment.value

    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
}

const subtractMoney = () => {
  // e.preventDefault()
  fetch('transactions/withdrawl', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'withdrawl',
      amount: + (inputAmount.value) * -1,
      comment: inputComment.value

    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(`data: ${data}`)
      window.location.reload(true)
    })
}


Array.from(saveBttns).forEach(function (element) {
  element.addEventListener('click', function () {
    const comment = this.parentNode.parentNode.childNodes[5].value
    console.log(this.dataset.id)
    fetch('transactions', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: comment,
        id: this.dataset.id
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data, `this is data`)
        // window.location.reload(true)
        const comment = this.parentNode.parentNode.childNodes[3]
        comment.innerText = data.value.comment
        const floppyDIsk = this.parentNode
        const pencil = this.parentNode.parentNode.childNodes[7]
        const editInput = this.parentNode.parentNode.childNodes[5]
        pencil.classList.remove('hide')
        comment.classList.remove('hide')
        floppyDIsk.classList.add('hide')
        editInput.classList.add('hide')

      })
  });
});

Array.from(editBttns).forEach(function (element) {
  element.addEventListener('click', function () {
    const comment = this.parentNode.parentNode.childNodes[3]
    const pencil = this.parentNode
    const floppyDIsk = this.parentNode.parentNode.childNodes[9]
    const editInput = this.parentNode.parentNode.childNodes[5]
    pencil.classList.add('hide')
    comment.classList.add('hide')
    floppyDIsk.classList.remove('hide')
    editInput.classList.remove('hide')

    console.log(this.dataset)

  });
});


Array.from(TrashBttns).forEach(function (element) {
  element.addEventListener('click', function () {
    fetch('transactions', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.dataset.id
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});



withdrawlBttn.addEventListener('click', subtractMoney)
depositBttn.addEventListener('click', addMoney)


