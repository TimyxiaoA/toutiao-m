const a1 = [1, 2, 3, 4, 5]
const a2 = [1, 2, 3, 6, 7]
/* a1.forEach(item1 => {
  const r = a2.find(item2 => item2 === item1)
  if (!r) {
    a3.push(item1)
  }
})
console.log(a3) // [4,5] */
const r = a1.filter(item1 => {
  return !a2.find(item2 => item2 === item1)
})
console.log(r) // [4,5]
