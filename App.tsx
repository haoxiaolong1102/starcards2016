import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CarDetail } from './pages/CarDetail';
import { CreateCar } from './pages/CreateCar';
import { Profile } from './pages/Profile';
import { MerchantList, MOCK_MERCHANTS } from './pages/MerchantList';
import { MerchantDetail } from './pages/MerchantDetail';
import { OrderList } from './pages/OrderList';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { OrderResult } from './pages/OrderResult';
import { MerchantRegistration } from './pages/MerchantRegistration';
import { Collection } from './pages/Collection'; // Import
import { PaymentModal } from './components/PaymentModal';
import { Toast } from './components/Toast';
import { Car, CarStatus, HostType, Merchant, Order, CardResult, UserRole, User } from './types';

// --- MOCK DATA ---
// DEFAULT USER IS NORMAL USER (UserRole.USER)
const INITIAL_USER: User = {
  id: 'u1',
  name: '桃子气泡水',
  avatar: 'https://picsum.photos/seed/u1/200',
  favoriteArtists: ['白敬亭', '王安宇'],
  role: UserRole.USER 
};

// MOCK INITIAL ORDER FOR DEMO (So collection isn't empty)
const INITIAL_ORDERS: Order[] = [
    {
        id: 'o_mock_1',
        carId: 'c1',
        carTitle: '【白敬亭专车】现在就出发3 官方收藏卡',
        carImage: 'https://picsum.photos/seed/nowgo/600/600',
        items: [{ name: '白敬亭', count: 2 }],
        totalPrice: 256,
        status: 'OPENED',
        date: '2023-10-25',
        hits: [
            { id: 'h1', name: 'SSR 亲签', rarity: 'SSR', artistName: '白敬亭', imageUrl: 'https://picsum.photos/seed/card1/300/400' },
            { id: 'h2', name: 'R 常规卡', rarity: 'R', artistName: '白敬亭', imageUrl: 'https://picsum.photos/seed/card2/300/400' },
            { id: 'h3', name: 'SR 拍立得', rarity: 'SR', artistName: '白敬亭', imageUrl: 'https://picsum.photos/seed/card3/300/400' }
        ]
    }
];

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
    extraNote: '非偏远地区包邮，偏远地区到付。车一旦满员不支持退款。',
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
  const [user, setUser] = useState<User>(INITIAL_USER); // Track user state
  const [activeTab, setActiveTab] = useState('home');
  
  // State for different sub-views
  const [subView, setSubView] = useState<'none' | 'carDetail' | 'merchantDetail' | 'orders' | 'merchantDashboard' | 'orderResult' | 'merchantRegistration' | 'collection'>('none');
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS); // Use mock orders

  // Payment flow state
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<{items: {name:string, count:number}[], total: number} | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Logic: Handle Tab Changes
  const handleTabChange = (tab: string) => {
      setSubView('none'); 
      if (tab === 'create') {
          // INTERCEPT: If user is just a USER, send to registration
          if (user.role === UserRole.USER) {
              setSubView('merchantRegistration');
              // Don't change activeTab to 'create' visually, keep it on previous or show highlight
              setActiveTab('home'); 
              return;
          }
      }
      setActiveTab(tab);
  };

  // Logic: Register Merchant
  const handleRegisterMerchant = (role: UserRole) => {
      setUser({ ...user, role });
      showToast(role === UserRole.MERCHANT_A ? "认证成功！您已成为A类商家" : "认证成功！您已成为B类粉头");
      setSubView('none');
      setActiveTab('create'); // Now they can go to create
  };

  // Routing Logic
  const handleCarClick = (car: Car) => {
    const latestCar = cars.find(c => c.id === car.id) || car;
    setSelectedCar(latestCar);
    setSubView('carDetail');
  };

  const handleMerchantClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setSubView('merchantDetail');
  };

  // Logic: When clicking host avatar in CarDetail
  const handleCarHostClick = (hostName: string) => {
      // 1. Try to find in MOCK_MERCHANTS
      let merchant = MOCK_MERCHANTS.find(m => m.name === hostName);
      
      // 2. If not found (e.g., user is the host or it's a random generated host)
      if (!merchant) {
          // Check if it is the current user
          const isCurrentUser = hostName === user.name;
          
          // Construct a temporary merchant object to view their profile
          merchant = {
              id: isCurrentUser ? 999 : Math.floor(Math.random() * 10000),
              name: hostName,
              rating: 5.0,
              activeCars: cars.filter(c => c.hostName === hostName).length,
              tags: isCurrentUser ? ["我"] : ["车头"],
              isLive: false,
              avatar: isCurrentUser ? user.avatar : `https://picsum.photos/seed/${hostName}/100`, // Use same seed logic as CarDetail
              fans: isCurrentUser ? 1 : Math.floor(Math.random() * 500),
              description: isCurrentUser ? "这是我在 StarCards 发布的拼团列表。" : "这位车头很神秘，还没有填写简介。"
          };
      }
      
      setSelectedMerchant(merchant);
      setSubView('merchantDetail');
  };

  const handleViewOrders = () => {
    setSubView('orders');
    setActiveTab('profile'); 
  };

  const handleViewCollection = () => {
    setSubView('collection');
    setActiveTab('profile');
  };

  const handleBackToMain = () => {
    setSubView('none');
    setSelectedCar(null);
    setSelectedMerchant(null);
    setViewingOrder(null);
  };

  // Entry to Merchant Dashboard (Only for approved merchants)
  const handleOpenMerchantDashboard = () => {
      if (user.role === UserRole.USER) {
          showToast("您还不是发车人，请先去申请");
          setSubView('merchantRegistration');
          return;
      }
      setSubView('merchantDashboard');
  };

  // Entry to Order Results
  const handleViewOrderResult = (order: Order) => {
      setViewingOrder(order);
      setSubView('orderResult');
  };

  // Updated to handle custom slots from CreateCar
  const handlePublish = (data: any) => {
    const newCar: Car = {
        ...BASE_CAR_1,
        id: `new_${Date.now()}`,
        title: `【${data.ipName}】${data.description.split('\n')[0]}`, // Simple title generation
        description: data.description,
        extraNote: data.extraNote, // Capture extra note
        ipName: data.ipName,
        boxCount: data.boxCount,
        hostName: user.name, 
        hostType: user.role === UserRole.MERCHANT_A ? HostType.MERCHANT : HostType.FAN_LEADER,
        hostRating: 5.0, 
        createdAt: new Date().toISOString(),
        supplierName: user.name, // Default to self as per new requirement
        slots: data.customSlots, // Use custom slots
        coverImage: data.coverImage || BASE_CAR_1.coverImage
    };
    setCars([newCar, ...cars]);
    showToast("发车成功！已回到大厅");
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
          carId: selectedCar.id,
          carTitle: selectedCar.title,
          carImage: selectedCar.coverImage,
          items: pendingPurchase.items,
          totalPrice: pendingPurchase.total,
          status: 'PAID',
          date: new Date().toLocaleDateString(),
          hits: []
      };
      setOrders([newOrder, ...orders]);

      // 2. Update Car State (Global Inventory Deduction)
      const updatedCars = cars.map(c => {
          if (c.id === selectedCar.id) {
              const updatedSlots = c.slots.map(slot => {
                  const purchasedItem = pendingPurchase.items.find(i => i.name === slot.name);
                  if (purchasedItem) {
                      return { ...slot, takenSpots: Math.min(slot.totalSpots, slot.takenSpots + purchasedItem.count) };
                  }
                  return slot;
              });

              const isFull = updatedSlots.every(slot => slot.takenSpots >= slot.totalSpots);
              
              return { 
                  ...c, 
                  slots: updatedSlots,
                  status: isFull ? CarStatus.FULL : c.status
              };
          }
          return c;
      });
      
      setCars(updatedCars);
      setShowPayment(false);
      setPendingPurchase(null);
      setSubView('orders'); 
      setActiveTab('profile'); 
      showToast("支付成功！位置已锁定");
  };

  // --- MERCHANT LOGIC: DISTRIBUTE CARDS ---
  const handleUpdateCarStatus = (carId: string, status: CarStatus, results: Record<string, CardResult[]>) => {
      const updatedCars = cars.map(c => c.id === carId ? { ...c, status: status } : c);
      setCars(updatedCars);

      const updatedOrders = orders.map(order => {
          if (order.carId === carId) {
              const orderHits: CardResult[] = [];
              order.items.forEach(item => {
                  const hitsForArtist = results[item.name];
                  if (hitsForArtist && hitsForArtist.length > 0) {
                      orderHits.push(...hitsForArtist);
                  }
              });
              return { ...order, status: 'OPENED' as const, hits: orderHits };
          }
          return order;
      });
      
      setOrders(updatedOrders);
      showToast("开箱完成！已自动分卡");
      setSubView('none');
      setActiveTab('home');
  };

  const handleRequestShipping = () => {
      if (viewingOrder) {
          const updatedOrders = orders.map(o => o.id === viewingOrder.id ? { ...o, status: 'SHIPPED' as const } : o);
          setOrders(updatedOrders);
          setViewingOrder({ ...viewingOrder, status: 'SHIPPED' });
          showToast("申请成功！仓库将在 24h 内发货");
      }
  };

  // View Router
  const renderContent = () => {
    // 1. Intercepted Views
    if (subView === 'merchantRegistration') {
        return <MerchantRegistration onBack={handleBackToMain} onRegister={handleRegisterMerchant} />;
    }
    if (subView === 'collection') {
        return <Collection orders={orders} onBack={() => { setSubView('none'); setActiveTab('profile'); }} />;
    }

    // 2. Full Screen Sub-Views
    if (subView === 'carDetail' && selectedCar) {
      return (
        <CarDetail 
            car={selectedCar} 
            onBack={handleBackToMain} 
            onPurchase={handlePurchaseStart} 
            onHostClick={handleCarHostClick} // Pass the new handler
            showToast={showToast} 
        />
      );
    }
    if (subView === 'merchantDetail' && selectedMerchant) {
        return <MerchantDetail merchant={selectedMerchant} cars={cars} onBack={handleBackToMain} onCarClick={handleCarClick} showToast={showToast} />;
    }
    if (subView === 'orders') {
        return <OrderList orders={orders} onBack={() => { setSubView('none'); setActiveTab('profile'); }} showToast={showToast} onViewResult={handleViewOrderResult} />;
    }
    if (subView === 'merchantDashboard') {
        return <MerchantDashboard cars={cars} onBack={handleBackToMain} onUpdateCarStatus={handleUpdateCarStatus} showToast={showToast} />;
    }
    if (subView === 'orderResult' && viewingOrder) {
        return <OrderResult order={viewingOrder} onBack={() => setSubView('orders')} showToast={showToast} onRequestShipping={handleRequestShipping} />;
    }

    // 3. Tab Views
    if (activeTab === 'create') {
      return <CreateCar onBack={() => setActiveTab('home')} onPublish={handlePublish} userRole={user.role} />;
    }

    switch (activeTab) {
      case 'home': return <Home cars={cars} onCarClick={handleCarClick} />;
      case 'merchants': return <MerchantList onMerchantClick={handleMerchantClick} />;
      case 'profile': return (
        <Profile 
            user={user} 
            orders={orders} // Pass orders
            onViewOrders={handleViewOrders} 
            onViewCollection={handleViewCollection} // Pass handler
            showToast={showToast} 
            onOpenMerchant={handleOpenMerchantDashboard} 
        />
      );
      default: return <Home cars={cars} onCarClick={handleCarClick} />;
    }
  };

  return (
    <>
        <Layout 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          hideNav={subView !== 'none' || activeTab === 'create'} // Updated: Hide nav when creating car
        >
        {renderContent()}
        </Layout>

        {showPayment && pendingPurchase && (
            <PaymentModal 
                totalCost={pendingPurchase.total}
                onClose={() => setShowPayment(false)}
                onConfirm={handlePurchaseConfirm}
            />
        )}

        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </>
  );
}