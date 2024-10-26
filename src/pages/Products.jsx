import { useEffect, useState } from 'react';
import './Products.css'
import { AiFillProduct } from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";

function Products() {
    let [rate, setRate] = useState(0);
    let [data, setData] = useState({});
    let [list, setList] = useState([]);
    let [image, setImage] = useState(null);
    let [search, setSearch] = useState([]);
    let [currentPage, setcurrentPage] = useState(1);
    let [perPageData, setperPageData] = useState(2);
    let [page, setPage] = useState([]);

    useEffect(() => {
        let getItems = JSON.parse(localStorage.getItem('productDetails'));
        let totalPages = Math.ceil(getItems.length / perPageData);
        console.log(totalPages);

        let num = [];
        for (let i = 1; i <= totalPages; i++) {
            num.push(i);
        }
        setPage(num);

        let lastIndex = currentPage * perPageData;
        let firstIndex = lastIndex - perPageData;

        let paginationData = getItems.slice(firstIndex, lastIndex);
        console.log(paginationData);

        let pageDetails = paginationData ? paginationData : [];
        pageDetails ? setList(pageDetails) : setList([]);
    }, [setList,currentPage])

    let handleChange = (e) => {
        let { name, value } = e.target;
        if (name == 'image') {
            // console.log(e.target.files);
            let file = e.target.files[0];
            let reader = new FileReader();

            if (file) {
                reader.readAsDataURL(file);
            }

            reader.onload = () => {
                setImage(reader.result);
            }
            console.log(file);
        }
        setData({ ...data, [name]: value });
    }

    let searchData = (e) => {
        e.preventDefault();
        setSearch(e.target.searching.value);
    }

    let sorting = (e) => {
        let value = e.target.value;
        let sortData = [...list];

        if (value == 'highTolow') {
            sortData.sort((a, b) => b.price - a.price);
        }
        else if (value = 'lowToHigh') {
            sortData.sort((a, b) => a.price - b.price);
        }
        else if (value == 'highRating') {
            sortData.sort((a, b) => b.rating - a.rating);
        }
        else {
            sortData.sort((a, b) => a.rating - b.rating);
        }
        setList(sortData);
    }

    let submitData = (e) => {
        e.preventDefault();

        let newList = {
            ...data,
            'rating': rate,
            'image': image
        }
        let record = [...list, newList]
        setList(record);

        localStorage.setItem('productDetails', JSON.stringify(record));
        setData({});
        setImage('');
    }
    console.log(list);

    return (
        <>
            <header>
                <div className="container">
                    <div className="header">
                        <div className="row">
                            <div>
                                <AiFillProduct className='logo' />
                            </div>
                            <div className='nav-items'>
                                <a href="#">home</a>
                                <a href="#">about</a>
                                <a href="#">services</a>
                                <a href="#">contact us</a>
                            </div>
                            <div>
                                <a href="">
                                    <BsCart3 className='cart' />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section>
                <div className="container">
                    <div className="row">
                        <div className='product'>
                            <form method='post' onSubmit={submitData} style={{ display: "flex" }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <div style={{ marginBottom: "10px", display: "flex", gap: "15px" }}>
                                                <th>Product Name</th>
                                                <td>
                                                    <input type="text" name='productName' onChange={handleChange} value={data.productName ? data.productName : ""} />
                                                </td>

                                                <th>Rating</th>
                                                <td>
                                                    {[1, 2, 3, 4, 5].map((value, index) => {
                                                        index = index + 1;
                                                        return (
                                                            <GoStarFill name='rating' onClick={() => setRate(index)}
                                                                style={(rate) >= index ? { color: "yellow" } : { color: 'black' }} />
                                                        )
                                                    })}
                                                </td>
                                            </div>
                                        </tr>

                                        <tr>
                                            <div style={{ marginBottom: "10px", display: "flex", gap: "19px" }}>
                                                <th>Product Price</th>
                                                <td>
                                                    <input type="number" name='price' onChange={handleChange} value={data.price ? data.price : ""} />
                                                </td>
                                                <th>Image</th>
                                                <td>
                                                    <input type="file" name="image" onChange={handleChange} value={data.image ? data.image : ""} />
                                                    {/* {image && <img src={image} height={50} />} */}
                                                </td>
                                            </div>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <td>
                                                <button type="submit" style={{ padding: "4px 9px 4px 9px" }}>submit</button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="row">
                        <form method="post" onSubmit={searchData} className='searchSort'>
                            <div className='search'>
                                <input type="text" name="searching" placeholder='Search...' />
                                <button type="submit">Search</button>
                            </div>

                            <select onClick={sorting} name='sorting' className='sort'>
                                <option value="highTolow">price: high to low</option>
                                <option value="lowToHigh">price: low to high</option>
                                <option value="highRating">rating: high to low</option>
                                <option value="lowRating">rating: low to high</option>
                            </select>
                        </form>
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: "30px" }}>
                <div className="container">
                    <div className="row">
                        {list.filter((v) => {
                            if (search == '') {
                                return v;
                            }
                            else if (v.productName.toLocaleLowerCase().match(search.toLocaleLowerCase())) {
                                return v;
                            }
                        }).map((v, i) => {
                            return (
                                <>
                                    <div className="box">
                                        <img src={v.image} width={250} height={200} className='image' />
                                        <h1>Name : {v.productName}</h1>
                                        <h2>Price : ₹{v.price}</h2>
                                        <h2 className='starRating'> Rating :
                                            {[1, 2, 3, 4, 5].map((starValue, index) => {
                                                return (
                                                    <GoStarFill
                                                        key={index} className='star'
                                                        style={{ color: v.rating >= starValue ? "yellow" : "white" }}
                                                    />
                                                );
                                            })}
                                        </h2>
                                    </div>
                                </>
                            )
                        })
                        }
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <div className="row">
                        <div className="pagination">
                            {page.map((v) => {
                                return (
                                    <button onClick={() => setcurrentPage(v)} >{v}</button>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Products;