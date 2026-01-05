import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CarDetail } from './pages/CarDetail';
import { CreateCar } from './pages/CreateCar';
import { Profile } from './pages/Profile';
import { MerchantList, MOCK_MERCHANTS } from './pages/MerchantList';
import { MerchantDetail } from './pages/MerchantDetail';
import { OrderList } from './pages/OrderList';
import { PaymentModal } from './components/PaymentModal';
import { Car, CarStatus, HostType, Merchant, Order } from './types';

// --- MOCK DATA ---
const MOCK_USER = {
  id: 'u1',
  name: '桃子气泡水',
  avatar: 'https://picsum.photos/seed/u1/200',
  favoriteArtists: ['白敬亭', '王安宇']
};

const BASE_CAR_1: Car = {
    id: 'c1',
    title: '【白敬亭专车】现在就出发3 官方收藏卡 2箱速拼',
    ipName: '现在就出发3',
    seriesName: '第一弹',
    boxCount: 2,
    hostName: '小葵花卡社',
    hostType: HostType.MERCHANT,
    hostRating: 4.9,
    status: CarStatus.RECRUITING,
    coverImage: 'https://picsum.photos/seed/nowgo/600/600',
    tags: ['含周边', '必出特卡'],
    description: '老师们好！白敬亭专车来了！\n\n目前白白位置还有3个，其他位置随便挑。\n保证正品原箱，直播开箱录像。\n\n不出意外今晚满车就开！',
    createdAt: '2023-10-27',
    slots: [
      { id: 's1', name: '白敬亭', avatarUrl: 'https://picsum.photos/seed/bai/100', price: 128, totalSpots: 5, takenSpots: 2, isHot: true },
      { id: 's2', name: '范丞丞', avatarUrl: 'https://picsum.photos/seed/fan/100', price: 108, totalSpots: 5, takenSpots: 4 },
      { id: 's3', name: '沈腾', avatarUrl: 'https://picsum.photos/seed/shen/100', price: 68, totalSpots: 5, takenSpots: 1 },
      { id: 's4', name: '金晨', avatarUrl: 'https://picsum.photos/seed/jin/100', price: 58, totalSpots: 5, takenSpots: 0 },
      { id: 's5', name: '贾冰', avatarUrl: 'https://picsum.photos/seed/jia/100', price: 48, totalSpots: 5, takenSpots: 1 },
    ]
};

const BASE_CAR_2: Car = {
    id: 'c2',
    title: '刺杀小说家2 阵营拼 3箱',
    ipName: '刺杀小说家2',
    seriesName: '电影特典',
    boxCount: 3,
    hostName: '芋泥波波',
    hostType: HostType.FAN_LEADER,
    hostRating: 4.7,
    status: CarStatus.RECRUITING,
    coverImage: 'https://picsum.photos/seed/assassin/600/600',
    tags: ['粉头车', '免邮'],
    description: '为爱发电！拼3箱试试手气。\n想要隐藏款的来冲！',
    createdAt: '2023-10-26',
    slots: [
      { id: 's21', name: '雷佳音', avatarUrl: 'https://picsum.photos/seed/lei/100', price: 88, totalSpots: 8, takenSpots: 2 },
      { id: 's22', name: '杨幂', avatarUrl: 'https://picsum.photos/seed/yang/100', price: 118, totalSpots: 8, takenSpots: 6, isHot: true },
      { id: 's23', name: '董子健', avatarUrl: 'https://picsum.photos/seed/dong/100', price: 78, totalSpots: 8, takenSpots: 3 },
    ]
};

// Generate more cars to test grid layout
const generateCars = (count: number): Car[] => {
    const cars = [BASE_CAR_1, BASE_CAR_2];
    const generated: Car[] = [];
    for(let i=0; i<count; i++) {
        const base = i % 2 === 0 ? BASE_CAR_1 : BASE_CAR_2;
        generated.push({
            ...base,
            id: `gen_${i}`,
            title: i % 2 === 0 ? `【${i}号车】现在就出发3 现货秒发` : `【${i}号车】刺杀小说家2 来欧皇`,
            hostName: `商家${i+100}号`,
            hostRating: (4 + Math.random()).toFixed(1) as any,
            slots: base.slots.map(s => ({...s, takenSpots: Math.floor(Math.random() * s.totalSpots)})),
            coverImage: `https://picsum.photos/seed/car_${i}/400/500` // Vary images
        });
    }
    return generated;
};

const INITIAL_CARS = generateCars(10);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  // State for different sub-views (simulated router)
  const [subView, setSubView] = useState<'none' | 'carDetail' | 'merchantDetail' | 'orders'>('none');
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [orders, setOrders] = useState<Order[]>([]);

  // Payment flow state
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<{items: {name:string, count:number}[], total: number} | null>(null);

  // Routing Logic
  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setSubView('carDetail');
  };

  const handleMerchantClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setSubView('merchantDetail');
  };

  const handleViewOrders = () => {
    setSubView('orders');
    setActiveTab('profile'); // Force tab to profile context
  };

  const handleBackToMain = () => {
    setSubView('none');
    setSelectedCar(null);
    setSelectedMerchant(null);
  };

  const handlePublish = (data: any) => {
    console.log("Published:", data);
    const newCar: Car = {
        ...BASE_CAR_1,
        id: `new_${Date.now()}`,
        title: `【${data.ipName}】${data.boxCount}箱速拼`,
        description: data.description,
        ipName: data.ipName,
        boxCount: data.boxCount,
        hostName: MOCK_USER.name,
        hostType: HostType.FAN_LEADER,
        createdAt: new Date().toISOString()
    };
    setCars([newCar, ...cars]);
    alert("发车成功！已回到大厅");
    setActiveTab('home');
    setSubView('none');
  };

  // Start Purchase
  const handlePurchaseStart = (items: { name: string; count: number }[], totalCost: number) => {
      setPendingPurchase({ items, total: totalCost });
      setShowPayment(true);
  };

  // Confirm Purchase
  const handlePurchaseConfirm = () => {
      if (!selectedCar || !pendingPurchase) return;

      // 1. Create Order
      const newOrder: Order = {
          id: `ord_${Date.now()}`,
          carTitle: selectedCar.title,
          carImage: selectedCar.coverImage,
          items: pendingPurchase.items,
          totalPrice: pendingPurchase.total,
          status: 'PAID',
          date: new Date().toLocaleDateString()
      };
      setOrders([newOrder, ...orders]);

      // 2. Update Car Slots (Decrease available spots) in mock data
      const updatedCars = cars.map(c => {
          if (c.id === selectedCar.id) {
              const updatedSlots = c.slots.map(slot => {
                  const purchasedItem = pendingPurchase.items.find(i => i.name === slot.name);
                  if (purchasedItem) {
                      return { ...slot, takenSpots: Math.min(slot.totalSpots, slot.takenSpots + purchasedItem.count) };
                  }
                  return slot;
              });
              return { ...c, slots: updatedSlots };
          }
          return c;
      });
      setCars(updatedCars);

      // 3. Reset UI
      setShowPayment(false);
      setPendingPurchase(null);
      setSubView('orders'); // Redirect to orders
      setActiveTab('profile'); // Switch tab context
  };

  // View Router
  const renderContent = () => {
    // 1. Full Screen Sub-Views
    if (subView === 'carDetail' && selectedCar) {
      return (
        <CarDetail 
          car={selectedCar} 
          onBack={handleBackToMain}
          onPurchase={handlePurchaseStart}
        />
      );
    }
    if (subView === 'merchantDetail' && selectedMerchant) {
        return (
            <MerchantDetail 
                merchant={selectedMerchant}
                cars={cars} // Pass full list to filter inside
                onBack={handleBackToMain}
                onCarClick={handleCarClick}
            />
        );
    }
    if (subView === 'orders') {
        return <OrderList orders={orders} onBack={() => { setSubView('none'); setActiveTab('profile'); }} />;
    }

    // 2. Tab Views
    if (activeTab === 'create') {
      return (
        <CreateCar 
          onBack={() => setActiveTab('home')}
          onPublish={handlePublish}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Home cars={cars} onCarClick={handleCarClick} />;
      case 'merchants':
        return <MerchantList onMerchantClick={handleMerchantClick} />;
      case 'profile':
        return <Profile user={MOCK_USER} onViewOrders={handleViewOrders} />;
      default:
        return <Home cars={cars} onCarClick={handleCarClick} />;
    }
  };

  return (
    <>
        <Layout activeTab={activeTab} onTabChange={(tab) => {
            setSubView('none'); // Reset subview when changing tabs
            setActiveTab(tab);
        }}>
        {renderContent()}
        </Layout>

        {showPayment && pendingPurchase && (
            <PaymentModal 
                totalCost={pendingPurchase.total}
                onClose={() => setShowPayment(false)}
                onConfirm={handlePurchaseConfirm}
            />
        )}
    </>
  );
}