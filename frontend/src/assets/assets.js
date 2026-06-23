import logo from './brian_mutugi_hub.logo.png'

class Item {
constructor(id, name, price, img) {
  this.id = id
  this.name = name
  this.img = img
  this.price = price
}
}

export const items = [
  new Item(1, 'African Bracelet', 'KSH 450', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTR4LzzWSooXqGLGn55jASIHDkOfXu-Tl-8w&s'),
  new Item(2, 'Custom Beaded Bracelet', 'KSH 250', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzeoAeZB753VlJLCTrscHwhOB55rTZWaGPNQ&s' ),
  new Item(3, 'Kenyan Flag Theme Bracelet', 'KSH 300', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU7dIaetE_NQsSjzkdiyowZ1cOR7vq5iKayA&s' ),
  new Item(4, 'Custom Beaded Bracelet', 'KSH 200', 'https://mawuafrica.com/cdn/shop/files/mL156WExK7.jpg?v=1747750421'),
  new Item(5, 'Double Layered Bracelet', 'KSH 500', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROn_foLHQ83Y-CzoNSSegLnYl1yw1XCsjnwVuI6CpObyRFjXd16zqk9C8&s')
]

  export {logo}