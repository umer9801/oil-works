# Oil Per Litre Feature & Stock Management

## ✅ New Features Implemented

### 1. Separate Stock Sections with Tabs
The stock page now has 4 separate tabs for better organization:
- 🛢️ **Oil** - Tracks gallons, litres, and price per litre
- 🔧 **Oil Filter** - Standard quantity tracking
- 💨 **Air Filter** - Standard quantity tracking
- ❄️ **A/C Filter** - Standard quantity tracking

### 2. Oil Litre Management

#### When Adding Oil Stock:
- **Gallons**: Number of oil gallons
- **Litres per Gallon**: How many litres in one gallon (e.g., 4.5L)
- **Total Litres**: Automatically calculated (Gallons × Litres/Gallon)
- **Price per Litre**: Selling price for 1 litre
- **Sale Price per Gallon**: Full gallon price

**Example:**
- 10 Gallons
- 4.5 Litres per Gallon
- Total: 45 Litres available
- Price: Rs. 200 per litre

#### Oil Stock Display:
- Shows gallons, litres per gallon, total litres available
- Price per litre clearly displayed
- Low stock alert when gallons ≤ 5

### 3. Receipt Creation with Litre Selection

#### For Oil Items:
1. Select oil from dropdown
2. Modal appears asking "How many litres?"
3. Shows available litres and price per litre
4. Enter litres needed (e.g., 2.5L)
5. Calculates total: 2.5L × Rs. 200 = Rs. 500
6. Adds to receipt

#### For Filters:
- Select from dropdown
- Adds directly with quantity selector
- Standard quantity-based pricing

### 4. Automatic Stock Deduction

When a receipt is created:

**For Oil:**
- Deducts litres from total available
- Updates gallons automatically
- Example: Had 45L, sold 2.5L, now 42.5L remaining

**For Filters:**
- Deducts quantity sold
- Example: Had 10 filters, sold 2, now 8 remaining

### 5. Receipt Printing

Printed receipt shows:
- Item name
- Quantity or Litres used
- Price (per litre for oil, per unit for filters)
- Total amount
- All customer and vehicle details

## 📊 Stock Management Flow

### Adding Oil Stock:
```
1. Go to Stock Management
2. Click Oil tab
3. Click "+ Add Stock"
4. Fill in:
   - Item Name: "Castrol 10W-40"
   - Gallons: 10
   - Litres per Gallon: 4.5
   - Cost Price: Rs. 1500 per gallon
   - Sale Price per Gallon: Rs. 2000
   - Price per Litre: Rs. 450
5. System calculates: 10 × 4.5 = 45 litres total
6. Click "Add Stock"
```

### Selling Oil:
```
1. Create new receipt
2. Select customer
3. Click "Add Oil" dropdown
4. Select "Castrol 10W-40"
5. Modal opens
6. Enter litres: 3.5
7. Shows: 3.5L × Rs. 450 = Rs. 1,575
8. Click "Add to Receipt"
9. Complete receipt and print
10. Stock auto-deducts: 45L - 3.5L = 41.5L
```

### Adding Filters:
```
1. Go to Stock Management
2. Click appropriate tab (Oil Filter/Air Filter/AC Filter)
3. Click "+ Add Stock"
4. Fill in:
   - Item Name: "Mann Oil Filter"
   - Quantity: 20
   - Cost Price: Rs. 300
   - Sale Price: Rs. 500
5. Click "Add Stock"
```

### Selling Filters:
```
1. Create new receipt
2. Select customer
3. Select filter from appropriate dropdown
4. Adjust quantity if needed (default 1)
5. Complete receipt
6. Stock auto-deducts quantity
```

## 🎯 Key Benefits

1. **Flexible Oil Sales**: Sell by litre, not just full gallons
2. **Accurate Tracking**: Know exactly how many litres available
3. **Better Pricing**: Price per litre for partial sales
4. **Organized Stock**: Separate sections for each category
5. **Auto Deduction**: No manual stock updates needed
6. **Profit Tracking**: Track cost vs sale price accurately

## 📋 Database Schema Updates

### Stock Model:
```typescript
{
  itemName: String,
  quantity: Number, // Gallons for oil, units for filters
  costPrice: Number,
  salePrice: Number,
  category: 'oil' | 'oil-filter' | 'air-filter' | 'ac-filter',
  
  // Oil-specific fields:
  litresPerGallon: Number, // e.g., 4.5
  pricePerLitre: Number, // e.g., 450
  totalLitres: Number, // Auto-calculated: quantity × litresPerGallon
  
  updatedAt: Date
}
```

### Receipt Item Model:
```typescript
{
  itemId: String,
  itemName: String,
  category: String,
  quantity: Number, // For filters
  litres: Number, // For oil
  price: Number, // Total price
  costPrice: Number,
  total: Number
}
```

## 🔧 Technical Implementation

### Stock Deduction Logic:
```javascript
// For Oil:
if (item.category === 'oil' && item.litres) {
  newTotalLitres = currentTotalLitres - item.litres;
  newGallons = newTotalLitres / litresPerGallon;
  update({ totalLitres: newTotalLitres, quantity: newGallons });
}

// For Filters:
else {
  newQuantity = currentQuantity - item.quantity;
  update({ quantity: newQuantity });
}
```

### Price Calculation:
```javascript
// Oil by litres:
totalPrice = litres × pricePerLitre;

// Filters by quantity:
totalPrice = quantity × salePrice;
```

## 📱 User Interface

### Stock Page Tabs:
- Clean tab interface
- Shows item count per category
- Easy switching between categories
- Category-specific forms

### Receipt Creation:
- Separate dropdowns for each category
- Oil modal for litre selection
- Real-time price calculation
- Clear visual feedback

### Printed Receipt:
- Shows litres for oil items
- Shows quantity for filter items
- Professional layout
- Logo at top

## ⚠️ Important Notes

1. **Oil Stock**: Always tracked in both gallons and litres
2. **Partial Gallons**: System handles decimal gallons (e.g., 8.5 gallons)
3. **Stock Alerts**: Low stock alert when gallons ≤ 5
4. **Price Flexibility**: Can sell oil by any litre amount
5. **Auto Updates**: Stock updates immediately after receipt creation

## 🚀 Deployment

All changes are ready for deployment:
- ✅ Database models updated
- ✅ API endpoints handle stock deduction
- ✅ UI supports litre selection
- ✅ Receipt printing shows correct details
- ✅ Build successful

## 📝 Testing Checklist

- [x] Add oil stock with litres per gallon
- [x] View oil stock in separate tab
- [x] Select oil in receipt (modal appears)
- [x] Enter litres and see price calculation
- [x] Add oil to receipt
- [x] Add filters to receipt
- [x] Create receipt and verify stock deduction
- [x] Print receipt with correct litre/quantity display
- [x] Verify oil litres deducted correctly
- [x] Verify filter quantity deducted correctly
- [x] Check low stock alerts
- [x] Edit/delete stock items

## 💡 Usage Tips

1. **Setting Up Oil**: Always enter litres per gallon accurately (usually 3.78L or 4.5L)
2. **Pricing**: Set both gallon price and per-litre price
3. **Selling**: Use litre selection for precise amounts
4. **Monitoring**: Check total litres available before selling
5. **Restocking**: Add new gallons, system recalculates total litres

## 🎓 Example Scenarios

### Scenario 1: Full Gallon Sale
- Customer needs 1 full gallon (4.5L)
- Select oil, enter 4.5 litres
- Price: 4.5L × Rs. 450 = Rs. 2,025

### Scenario 2: Partial Sale
- Customer needs 2 litres only
- Select oil, enter 2 litres
- Price: 2L × Rs. 450 = Rs. 900

### Scenario 3: Mixed Receipt
- 3.5 litres oil: Rs. 1,575
- 1 oil filter: Rs. 500
- 1 air filter: Rs. 400
- Total: Rs. 2,475
- All items auto-deducted from stock
