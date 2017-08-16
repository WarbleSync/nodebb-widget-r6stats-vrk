function showData(target){
  var tr = target.nextElementSibling
  if(tr.style.display === 'none'){
    tr.style.display = 'block'
  } else {
    tr.style.display = 'none'
  }
  // console.log(target.nextElementSibling.style.display)
}
