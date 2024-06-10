import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CrediteNote.css';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function SalesOrder() {

  const [CreditNo, setCreditNo] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [partyName, setPartyName] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [description, setDescription] = useState('');

  const [itemName,setItemName]=useState('');
   const [quantity,setQuantity]=useState('');
   const [rate,setRate]=useState('');
   const [unit,setUnit]=useState('');
   const [discount,setDiscount]=useState('');
   const [amount,setAmount]=useState('');
   const [totalAmount, setTotalAmount] = useState('');
  const dateInputRef = useRef(null);
  const handleDateChange = (event) => {
    const inputDate = event.target.value;
    setDate(inputDate);

    const inputDay = new Date(inputDate).toLocaleDateString('en-IN', { weekday: 'long' });
    setDay(inputDay);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'D' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        if (dateInputRef.current && dateInputRef.current.focus) {
          dateInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addNewItemRow = () => {
   
    const newRow = document.createElement('tr');

  
      const cells = ['itemName', 'quantity', 'rate', 'unit', 'discount', 'amount'].map((field) => {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = field === 'quantity' || field === 'rate' || field === 'discount' ? 'number' : 'text';
      input.placeholder = field.charAt(0).toUpperCase() + field.slice(1); 
      input.value = ''; 
      input.addEventListener('input', (event) => handleItemInputChange(event, field));
      cell.appendChild(input);
      return cell;
    
    });

    cells.forEach((cell) => {
      newRow.appendChild(cell);
    });

   
    const tableBody = document.querySelector('.tablesData table tbody');
    tableBody.appendChild(newRow);
   
  };

  const removeLastItemRow = () => {
    const tableBody = document.querySelector('.tablesData table tbody');
    const rows = tableBody.querySelectorAll('tr');
    if (rows.length > 1) {
      tableBody.removeChild(rows[rows.length - 1]);
    }
  };

  const handleItemInputChange = (event, field) => {
   
    const value = event.target.value;

    switch (field) {
      case 'itemName':
        setItemName(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'rate':
        setRate(value);
        break;
      case 'unit':
        setUnit(value);
        break;
      case 'discount':
        setDiscount(value);
        break;
      case 'amount':
        setAmount(value);
        break;
      default:
        break;
    }
  };
 const handleKeyPress = (event) => {
    if (event.key === 'Shift') {
  
      event.preventDefault();
      const amountInput = document.activeElement;
      if (amountInput && amountInput.name === 'amount') {
        addNewItemRow();
      }
      
    } else if (event.key === 'Backspace') {
      if (document.activeElement.tagName !== 'INPUT'&& document.activeElement.tagName !== 'TEXTAREA' ) {
        event.preventDefault();
        removeLastItemRow();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const calculatedAmount = quantity * rate - discount;
    setAmount(calculatedAmount);
  }, [quantity, rate, discount]);
  useEffect(() => {
  
    setTotalAmount(amount);
  }, [amount]);
 

  const saveSalesOrder = async () => {
    if (
      !CreditNo ||
      !orderNo ||
      !date ||
      !day ||
      !partyName ||
      !currentBalance ||
      !description ||
      !itemName ||
      !quantity ||
      !rate ||
      !unit ||
      !discount ||
      !amount
    ) {
      alert('Please fill in all the required fields before saving.');
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to save the sales order?');

    if (isConfirmed) {

      const data = {
        CreditNo,
        orderNo,
        date,
        day,
        partyName,
        currentBalance,
        description,
         itemName,
         quantity,
         rate,
         unit,
         discount,
         amount,
        totalAmount,
      };

      console.log('Data to be sent:', data);

      try {
        const response = await axios.post('http://localhost:1111/save', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Server response:', response.data);

        toast.success('Voucher added successfully.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      } catch (error) {
        console.error('Error adding Voucher:', error.message);

        toast.error(`Error adding Voucher: ${error.message}`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <div>
      <ToastContainer/>
    <div className='mainSale'>
      
     <div className="separator2"></div>
      <div className='head'>
      <h3>CrediteNote  Voucher Creation</h3>
      </div>
      <form onSubmit={saveSalesOrder}>
      <div className='SalesInput'>
        <label><div className='high'>Credit No </div> No :</label>
        <input type="number" value={CreditNo} 
        onChange={e => setCreditNo(e.target.value)} 
        onInput={(e)=>{
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        }}
        required/>
      </div>
      <div className='DateDiv'>
        <label>Date:</label>
        <input type="date"
           ref={dateInputRef} 
            value={date} onChange={handleDateChange} required />
      <p>{day}</p>

      </div>
      <div className='OrderDiv'>
        <label>Order No:</label>
        <input type="text" value={orderNo} 
        onChange={e => setOrderNo(e.target.value)}

        pattern="^(?=.*[!@#$%^&*])(?!.*[!@#$%^&*].*[!@#$%^&*])(?=.*[a-zA-Z]{3,}).*$"
         title='Fill the order number'
         onInput={(e) => {
            //  e.target.value = e.target.value.replace(/[^a-zA-Z\s.,#&+-]/g, '');
            e.target.value = e.target.value.replace(/\s{2,}/g, ' ');
            
        }}
        required />
      </div>
      <div className='Combo'>
        <label>Party A/C Name:</label>
        <input type="text" value={partyName} onChange={e => setPartyName(e.target.value)} 
         pattern="^[a-zA-Z]{3,}[a-zA-Z\s][0-9]*$"
         title='Fill the party A/c Name'
        onInput={(e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s.,_$]/g, '');
            e.target.value = e.target.value.replace(/\s{2,}/g, ' ');
            
        }}
        required
        /><br/>
        <label>Current Balance:</label>
        <input type="number" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} required />
      </div>
      <div className="separator1"></div>
    
      <div className="tablesData">
        <table>
          <thead>
            <tr>
               
              <th>Name Of Item</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Unit</th>
              <th>Discount</th>
              <th>Amount</th>
             
            </tr>
          </thead>
          <tbody>
          
              <tr >
                <td className="leftAlign">
                  <input
                    type="text"
                    placeholder="Name of Item"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    pattern="^[a-zA-Z]{3,}[a-zA-Z\s][0-9]*$"
                    title='Fill the item Name'
                   onInput={(e) => {
                       e.target.value = e.target.value.replace(/[^a-zA-Z\s.,_$]/g, '');
                       e.target.value = e.target.value.replace(/\s{2,}/g, ' ');
                       
                   }}required
                  />
                 
                </td>
              
                <td >
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Rate"
                    value={rate}
                    onChange={(e) =>setRate(e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Unit"
                    value={unit}
                    onChange={(e) =>setUnit(e.target.value)}
                    pattern="^[a-zA-Z]{2,}[a-zA-Z\s]*$"
                    title='Fill the unit'
                    onInput={(e) => {
                       e.target.value = e.target.value.replace(/[^a-zA-Z\s.,_$]/g, '');
                       e.target.value = e.target.value.replace(/\s{2,}/g, ' ');
                       
                   }}
                   required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                  />
                </td>
                <td>
                <input
                   type="number"
                   placeholder="Amount"
                   value={amount}
                   name='amount'
                   onChange={(e) => setAmount(e.target.value)}
                  //  onKeyDown={(e) => setItems(e.target.value)} 
                  /> 
                </td>
           
              </tr>
                    </tbody>
        </table>
        {/* <button onClick={addNewItemRow} className="addBtn">
          Add Row
        </button> */}
      
      </div>
      <div className='total'>
        <label>Total Amount:</label>
        <input type="text" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
      </div>
      <div className='Desc'>
        <label className='DescName'>Description :</label>
        <textarea type="text" className='descInput' value={description} onChange={e => setDescription(e.target.value)}
         pattern="^[a-zA-Z]{3,}[a-zA-Z\s][0-9]*$"
          onInput={(e)=>{
           
            e.target.value = e.target.value.replace(/\s{2,}/g, ' ');
        
          }}
          required 
        />
      </div>
      <button  className='btn'>Save</button>
      </form>
      {/* <table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>Unit</th>
          <th>Discount Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.itemName}</td>
            <td>{item.quantity}</td>
            <td>{item.rate}</td>
            <td>{item.unit}</td>
            <td>{item.discountAmount}</td>
          </tr>
        ))}
      </tbody>
    </table> */}
    </div>
        
    </div>  
  

  )
}
