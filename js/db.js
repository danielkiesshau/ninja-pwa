// offline data
db.enablePersistence()
  .catch(err => {
    if(err.code === 'failed-precondition') { 
      // probably multiple tabs open at once
      console.log('persistence failed')
    } else if(err.code === 'unimplemented') { 
      // lack of browser support
      console.log('persistence is not available')
    }
  })

// real-time listener
db.collection('recipes').onSnapshot(snapshot => {
  console.log('snapshot', snapshot)
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      renderRecipe(change.doc.data(), change.doc.id)
    } else if (change.type === 'removed') {
      removeRecipe(change.doc.id)
    }
  })
})

// add new recipe
const form = document.querySelector('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  }

  db.collection('recipes').add(recipe)
    .catch(err => console.log(err))

  form.title.value = ''
  form.ingredients.value = ''
})