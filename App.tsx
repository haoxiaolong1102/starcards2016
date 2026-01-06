import React, { useState, useEffect } from 'react';
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
import { Car, CarStatus, HostType, Merchant, Order, CardResult, UserRole, User, LiveInfo, MerchantWallet, BannerCampaign, BannerSlotId, Transaction, WithdrawalRequest } from './types';

// --- CONSTANTS ---
const PLATFORM_FEE_RATE = 0.025; // 2.5% Tech Service Fee
const PAYMENT_FEE_RATE = 0.004;  // 0.4% Payment Channel Fee

// --- MOCK DATA ---
const INITIAL_USER: User = {
  id: 'u1',
  name: '桃子气泡水',
  avatar: 'https://picsum.photos/seed/u1/200',
  favoriteArtists: ['白敬亭', '王安宇'],
  role: UserRole.USER 
};

// Initial Banners
const INITIAL_BANNERS: BannerCampaign[] = [
    {
        id: 'b1',
        merchantName: '系统',
        slotId: BannerSlotId.HOME_TOP,
        imageUrl: 'https://picsum.photos/seed/banner1/800/400',
        targetUrl: '',
        title: '新人福利',
        startTime: '2023-01-01',
        endTime: '2024-12-31',
        status: 'ACTIVE',
        price: 0,
        impressionCount: 1200,
        clickCount: 450
    },
    {
        id: 'b2',
        merchantName: '小葵花卡社',
        slotId: BannerSlotId.HOME_TOP,
        imageUrl: 'https://picsum.photos/seed/banner2/800/400',
        targetUrl: '',
        title: '现在就出发3 现货秒发',
        startTime: '2023-10-01',
        endTime: '2023-11-01',
        status: 'ACTIVE',
        price: 500,
        impressionCount: 800,
        clickCount: 120
    }
];

// Initial Wallets (Mock for "小葵花卡社" aka Current User if they are merchant)
const INITIAL_WALLET: MerchantWallet = {
    merchantName: '小葵花卡社',
    totalIncome: 15420.00,
    availableBalance: 3240.50,
    pendingBalance: 1280.00,
    frozenBalance: 0,
    transactions: [
        { id: 'tx_1', type: 'INCOME', amount: 96.00, date: '2023-10-20', description: '订单结算-白敬亭专车', status: 'SUCCESS' },
        { id: 'tx_2', type: 'FEE', amount: -2.50, date: '2023-10-20', description: '平台技术服务费', status: 'SUCCESS' },
    ],
    withdrawals: []
};

// MOCK INITIAL ORDER
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
  const [user, setUser] = useState<User>(INITIAL_USER); 
  const [activeTab, setActiveTab] = useState('home');
  const [subView, setSubView] = useState<'none' | 'carDetail' | 'merchantDetail' | 'orders' | 'merchantDashboard' | 'orderResult' | 'merchantRegistration' | 'collection'>('none');
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  // Commercial State
  const [banners, setBanners] = useState<BannerCampaign[]>(INITIAL_BANNERS);
  const [myWallet, setMyWallet] = useState<MerchantWallet>(INITIAL_WALLET); // In real app, fetch based on user

  // Payment flow state
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<{items: {name:string, count:number}[], total: number} | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // --- SETTLEMENT ENGINE ---
  // Mock function to "Complete" an order and trigger settlement
  const handleCompleteOrder = (order: Order) => {
      if (order.status === 'COMPLETED' || order.isSettled) return;

      // 1. Calculate Fees
      const serviceFee = Number((order.totalPrice * PLATFORM_FEE_RATE).toFixed(2));
      const paymentFee = Number((order.totalPrice * PAYMENT_FEE_RATE).toFixed(2));
      const settledAmount = Number((order.totalPrice - serviceFee - paymentFee).toFixed(2));

      // 2. Update Order
      const updatedOrder: Order = {
          ...order,
          status: 'COMPLETED',
          isSettled: true,
          serviceFee,
          paymentFee,
          settledAmount
      };
      setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));

      // 3. Update Wallet (Simulating the merchant is "小葵花卡社")
      // In real app, check order.hostName === myWallet.merchantName
      const newTransactions: Transaction[] = [
          {
              id: `tx_${Date.now()}_inc`,
              type: 'INCOME',
              amount: order.totalPrice,
              date: new Date().toLocaleDateString(),
              description: `订单结算-${order.carTitle}`,
              status: 'SUCCESS'
          },
          {
              id: `tx_${Date.now()}_fee`,
              type: 'FEE',
              amount: -(serviceFee + paymentFee),
              date: new Date().toLocaleDateString(),
              description: `平台服务费(2.5%)+支付费(0.4%)`,
              status: 'SUCCESS'
          }
      ];

      setMyWallet(prev => ({
          ...prev,
          totalIncome: prev.totalIncome + order.totalPrice,
          availableBalance: prev.availableBalance + settledAmount,
          transactions: [...newTransactions, ...prev.transactions]
      }));

      showToast(`订单已完成，入账 ¥${settledAmount}`);
  };

  // --- WITHDRAWAL LOGIC ---
  const handleWithdraw = (amount: number) => {
      // 1. Validation
      if (amount < 100) {
          showToast("最低提现金额 100 元");
          return;
      }
      if (amount > myWallet.availableBalance) {
          showToast("余额不足");
          return;
      }

      // 2. Fee Logic (Mock: First one today is free, else 0.1%)
      const todayString = new Date().toLocaleDateString();
      const hasWithdrawToday = myWallet.withdrawals.some(w => w.requestDate === todayString);
      const fee = hasWithdrawToday ? Number((amount * 0.001).toFixed(2)) : 0;
      const actualAmount = amount - fee;

      // 3. Create Request
      const newWithdrawal: WithdrawalRequest = {
          id: `wd_${Date.now()}`,
          amount,
          fee,
          actualAmount,
          requestDate: todayString,
          expectedDate: 'T+1工作日',
          status: 'PENDING'
      };

      // 4. Update Wallet
      setMyWallet(prev => ({
          ...prev,
          availableBalance: prev.availableBalance - amount,
          withdrawals: [newWithdrawal, ...prev.withdrawals],
          transactions: [{
              id: `tx_${Date.now()}_wd`,
              type: 'WITHDRAW',
              amount: -amount,
              date: todayString,
              description: `提现申请 ${hasWithdrawToday ? '(含手续费)' : '(免手续费)'}`,
              status: 'PENDING'
          }, ...prev.transactions]
      }));

      showToast("提现申请已提交，预计T+1到账");
  };

  // --- BANNER LOGIC ---
  const handleCreateBanner = (slotId: BannerSlotId, title: string, img: string) => {
      const newBanner: BannerCampaign = {
          id: `b_${Date.now()}`,
          merchantName: myWallet.merchantName,
          slotId,
          imageUrl: img,
          targetUrl: '',
          title,
          startTime: new Date().toLocaleDateString(),
          endTime: '待审核',
          status: 'PENDING',
          price: 0,
          impressionCount: 0,
          clickCount: 0
      };
      setBanners([...banners, newBanner]);
      showToast("推广申请已提交，等待审核");
  };

  // Logic: Handle Tab Changes
  const handleTabChange = (tab: string) => {
      setSubView('none'); 
      if (tab === 'create') {
          if (user.role === UserRole.USER) {
              setSubView('merchantRegistration');
              setActiveTab('home'); 
              return;
          }
      }
      setActiveTab(tab);
  };

  const handleRegisterMerchant = (role: UserRole) => {
      setUser({ ...user, role });
      showToast(role === UserRole.MERCHANT_A ? "认证成功！您已成为A类商家" : "认证成功！您已成为B类粉头");
      setSubView('none');
      setActiveTab('create'); 
  };

  const handleCarClick = (car: Car) => {
    const latestCar = cars.find(c => c.id === car.id) || car;
    setSelectedCar(latestCar);
    setSubView('carDetail');
  };

  const handleMerchantClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setSubView('merchantDetail');
  };

  const handleCarHostClick = (hostName: string) => {
      let merchant = MOCK_MERCHANTS.find(m => m.name === hostName);
      if (!merchant) {
          const isCurrentUser = hostName === user.name;
          merchant = {
              id: isCurrentUser ? 999 : Math.floor(Math.random() * 10000),
              name: hostName,
              rating: 5.0,
              activeCars: cars.filter(c => c.hostName === hostName).length,
              tags: isCurrentUser ? ["我"] : ["车头"],
              isLive: false,
              avatar: isCurrentUser ? user.avatar : `https://picsum.photos/seed/${hostName}/100`,
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

  const handleOpenMerchantDashboard = () => {
      if (user.role === UserRole.USER) {
          showToast("您还不是发车人，请先去申请");
          setSubView('merchantRegistration');
          return;
      }
      setSubView('merchantDashboard');
  };

  const handleViewOrderResult = (order: Order) => {
      setViewingOrder(order);
      setSubView('orderResult');
  };

  const handlePublish = (data: any) => {
    const newCar: Car = {
        ...BASE_CAR_1,
        id: `new_${Date.now()}`,
        title: `【${data.ipName}】${data.description.split('\n')[0]}`, 
        description: data.description,
        extraNote: data.extraNote,
        ipName: data.ipName,
        boxCount: data.boxCount,
        hostName: user.name, 
        hostType: user.role === UserRole.MERCHANT_A ? HostType.MERCHANT : HostType.FAN_LEADER,
        hostRating: 5.0, 
        createdAt: new Date().toISOString(),
        supplierName: user.name,
        slots: data.customSlots,
        coverImage: data.coverImage || BASE_CAR_1.coverImage
    };
    setCars([newCar, ...cars]);
    showToast("发车成功！已回到大厅");
    setActiveTab('home');
    setSubView('none');
  };

  const handlePurchaseStart = (items: { name: string; count: number }[], totalCost: number) => {
      setPendingPurchase({ items, total: totalCost });
      setShowPayment(true);
  };

  const handlePurchaseConfirm = () => {
      if (!selectedCar || !pendingPurchase) return;

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

          // SIMULATE: After shipping, the order becomes COMPLETED automatically after some time
          // Here we do it instantly for demo purposes to trigger settlement
          setTimeout(() => {
              handleCompleteOrder({ ...viewingOrder, status: 'SHIPPED' }); // Pass latest state
          }, 3000);
      }
  };

  const handleSetCarLive = (carId: string, liveInfo: LiveInfo | undefined) => {
      const updatedCars = cars.map(c => c.id === carId ? { ...c, liveInfo } : c);
      setCars(updatedCars);
      if (liveInfo?.isLive) {
          showToast(`已开启直播！用户可在详情页查看`);
      } else {
          showToast("直播状态已结束");
      }
  };

  const renderContent = () => {
    if (subView === 'merchantRegistration') {
        return <MerchantRegistration onBack={handleBackToMain} onRegister={handleRegisterMerchant} />;
    }
    if (subView === 'collection') {
        return <Collection orders={orders} onBack={() => { setSubView('none'); setActiveTab('profile'); }} />;
    }

    if (subView === 'carDetail' && selectedCar) {
      return (
        <CarDetail 
            car={selectedCar} 
            onBack={handleBackToMain} 
            onPurchase={handlePurchaseStart} 
            onHostClick={handleCarHostClick}
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
        return (
            <MerchantDashboard 
                cars={cars} 
                onBack={handleBackToMain} 
                onUpdateCarStatus={handleUpdateCarStatus} 
                showToast={showToast} 
                onSetLive={handleSetCarLive} 
                wallet={myWallet}
                banners={banners}
                onWithdraw={handleWithdraw}
                onCreateBanner={handleCreateBanner}
            />
        ); 
    }
    if (subView === 'orderResult' && viewingOrder) {
        return <OrderResult order={viewingOrder} onBack={() => setSubView('orders')} showToast={showToast} onRequestShipping={handleRequestShipping} />;
    }

    if (activeTab === 'create') {
      return <CreateCar onBack={() => setActiveTab('home')} onPublish={handlePublish} userRole={user.role} />;
    }

    switch (activeTab) {
      case 'home': return <Home cars={cars} onCarClick={handleCarClick} banners={banners.filter(b => b.status === 'ACTIVE' && b.slotId === BannerSlotId.HOME_TOP)} />;
      case 'merchants': return <MerchantList onMerchantClick={handleMerchantClick} />;
      case 'profile': return (
        <Profile 
            user={user} 
            orders={orders}
            onViewOrders={handleViewOrders} 
            onViewCollection={handleViewCollection}
            showToast={showToast} 
            onOpenMerchant={handleOpenMerchantDashboard} 
        />
      );
      default: return <Home cars={cars} onCarClick={handleCarClick} banners={banners.filter(b => b.status === 'ACTIVE' && b.slotId === BannerSlotId.HOME_TOP)} />;
    }
  };

  return (
    <>
        <Layout 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          hideNav={subView !== 'none' || activeTab === 'create'}
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