import { useState } from 'react'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState({});
  const [account, setAccount] = useState({
    username: "",
    password: ""
  })

  const getValue = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value
    })
  }

  const submitAccount = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);
        setIsAuth(true)
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        axios.defaults.headers.common['Authorization'] = token;
        getProductList();
      } catch (error) {
        alert('登入失敗，請新輸入帳號密碼')
      }
    })()
  }

  const getProductList = () =>{
    (async () => {
      try {
        const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/admin/products`);
        setProducts(res.data.products)
      } catch (error) {
        alert('取得資料失敗')
      }
    })()
  }

  const checkLogin = ()=>{
    (async () => {
      try {
        const res = await axios.post(`${baseUrl}/v2/api/user/check`)
        alert("使用者已登入")
      } catch (error) {
        alert("使用者未登入")
      }
    })()
  }

  return (
    <>
      {
        isAuth ?
          (<div className="container mt-5" >
            <div className="row">
              <div className="col-6">
                <button type="button" onClick={checkLogin} className="btn btn-danger mb-3">驗證是否登入</button>
                <h2>產品列表</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">產品名稱</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col">是否啟用</th>
                      <th scope="col">查看細節</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      return (
                        <tr key={product.id}>
                          <th scope="row">{product.title}</th>
                          <td>{product.origin_price}</td>
                          <td>{product.price}</td>
                          <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                          <td><button className="btn btn-primary" onClick={() => {
                            setTempProduct(product);
                          }}>查看細節</button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col-6">
                <h2>單一產品細節</h2>
                {tempProduct.title ? (<div className="card">
                  <img src={tempProduct.imageUrl} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">{tempProduct.title} <span className="badge btn btn-primary">{tempProduct.category}</span></h5>
                    <p className="card-text">商品描述:{tempProduct.description}</p>
                    <p className="card-text">商品內容:{tempProduct.content}</p>
                    <p className="card-text"><del>{tempProduct.origin_price}</del>元/{tempProduct.price}元</p>
                    <h5 className="card-title">更多圖片</h5>
                    {tempProduct.imagesUrl?.map((item, index) => {
                      return <img src={item} alt="" className="img-fluid" key={index} />
                    })}
                  </div>
                </div>) : (<p>請選擇單一商品查看</p>)}
              </div>
            </div>
          </div>) : (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
              <h1 className="mb-5">請先登入</h1>
              <form className="d-flex flex-column gap-3" onSubmit={submitAccount}>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="username" name="username" onChange={getValue} value={account.username} placeholder="name@example.com" />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id="password" name="password" onChange={getValue} value={account.password} placeholder="Password" />
                  <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-primary">登入</button>
              </form>
              <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
            </div>
          )
      }
    </>
  )
}

export default App
