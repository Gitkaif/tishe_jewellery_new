import { addProduct } from './products';

const seedProducts = async () => {
  const products = [
    {
      id: '1',
      name: 'Diamond Solitaire Ring',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Rings',
      description: 'A beautiful diamond solitaire ring that sparkles with every movement.'
    },
    {
      id: '2',
      name: 'Pearl Necklace',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Necklaces',
      description: 'Elegant pearl necklace that adds a touch of class to any outfit.'
    },
    {
      id: '3',
      name: 'Gold Hoop Earrings',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Earrings',
      description: 'Classic gold hoop earrings that never go out of style.'
    },
    {
      id: '4',
      name: 'Silver Bangle',
      price: 199.99,
      image: 'https://i.etsystatic.com/25202454/r/il/12ada6/4269847150/il_1080xN.4269847150_33z5.jpg',
      category: 'Bracelets',
      description: 'Elegant silver bangle that can be worn alone or stacked.'
    }
  ];

  try {
    console.log('Seeding products...');
    for (const product of products) {
      await addProduct(product);
    }
    console.log('Successfully seeded products!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Run the seed function if this file is run directly
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // You can call seedProducts() from the browser console to seed the database
  window.seedProducts = seedProducts;
}

export default seedProducts;
