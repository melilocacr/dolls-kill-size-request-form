import React from 'react';

var stock = {
    "141975": [
        {
            "amlabel_image": "",
            "amlabel_width": "",
            "amlabel_height": "",
            "simple_id": "141989",
            "color_id": "3564",
            "color_text": "BLUE",
            "size_id": "1857",
            "size_text": "ONE SIZE",
            "quantity": 0,
            "display_brand": "3 AM Imports"
        }
    ],
    "142593": {
        "1": {
            "amlabel_image": "",
            "amlabel_width": "",
            "amlabel_height": "",
            "simple_id": "142605",
            "color_id": "3564",
            "color_text": "BLUE",
            "size_id": "1857",
            "size_text": "ONE SIZE",
            "quantity": 7,
            "display_brand": "Leg Avenue"
        }
    },
    "143249": {
        "3": {
            "amlabel_image": "",
            "amlabel_width": "",
            "amlabel_height": "",
            "simple_id": "143257",
            "color_id": "3563",
            "color_text": "BLUE",
            "size_id": "2898",
            "size_text": "Small",
            "quantity": 3,
            "display_brand": "Leg Avenue"
        },
        "4": {
            "amlabel_image": "",
            "amlabel_width": "",
            "amlabel_height": "",
            "simple_id": "143258",
            "color_id": "3563",
            "color_text": "BLUE",
            "size_id": "2901",
            "size_text": "Medium",
            "quantity": 8,
            "display_brand": "Leg Avenue"
        },
        "5": {
            "amlabel_image": "",
            "amlabel_width": "",
            "amlabel_height": "",
            "simple_id": "143259",
            "color_id": "3563",
            "color_text": "BLUE",
            "size_id": "2904",
            "size_text": "Large",
            "quantity": 0,
            "display_brand": "Leg Avenue"
        }
    },
    "150605": {
        "2": {
            "amlabel_image": "",
            "amlabel_width": "",
            "amlabel_height": "",
            "simple_id": "150619",
            "color_id": "3563",
            "color_text": "BLUE",
            "size_id": "1857",
            "size_text": "ONE SIZE",
            "quantity": 6,
            "display_brand": "In Your Dreams"
        }
    }
}

class RequestForm extends React.Component {
    constructor() {
        super();

        this.state = {
            productId: '',
            fetchedProducts: {},
            inputValid: true
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchProductData = this.fetchProductData.bind(this);
        this.validateFormInput = this.validateFormInput.bind(this);
    }

    handleChange(event) {
        this.setState({ productId: event.target.value });
    }

    validateFormInput(productIdInput) {
        let desiredInput = /^([0-9]+,)*[0-9]+$/;

        if (productIdInput.match(desiredInput)) {
            // form input is valid
            return 1;
        }
        else {
            // form input is invalid
            return 0;
        }
    }

    handleSubmit(event) {
        if (this.validateFormInput(this.state.productId)) {
            this.setState({inputValid: true})
            this.fetchProductData();
            event.preventDefault();
        }
        else {
            this.setState({inputValid: false})
        }

    }

    fetchProductData() {
        var sizeRequestUrl = 'https://www.dollskill.com/codetest/api.php?ids=' + this.state.productId + '&op=get_size_attributes';

        fetch(sizeRequestUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ fetchedProducts: result });
                    console.log(this.state.fetchedProducts);
                }
            )
    }

    render() {
        return (
            <div className={"row"}>
                <div className={"col-md-4 sidepanel"}>
                    <div className={"form-container"}>
                        <h2 className={"title"}>Product Size Info Request</h2>
                        <hr />
                        <p className={"medium"}>Enter product id(s) separated by commas (i.e 143249 or 142593,141975)</p>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="product-id">Product id(s):</label>
                                <input type="text" className = {this.state.inputValid ? "form-control" : "form-control is-invalid"}
                                    placeholder=""
                                    value={this.state.productId}
                                    onChange={this.handleChange} />
                                <span className={this.state.inputValid ? "hidden" : "red small"}>Format for product id(s) entered not valid</span>
                            </div>
                            <button type="submit" className={`btn btn-default btn-pink title`}>Submit</button>
                        </form>
                    </div>
                </div>
                <div className={"col-md-8 col-md-offset-4 product-info-panel"}>
                    <ProductList products={this.state.fetchedProducts} />
                </div>
            </div>
        );
    }
}

class ProductList extends React.Component {
    //stock = this.props.products;

    render() {
        return (
            Object.keys(stock).map(productId => {
                return (
                    <Product key={productId} productId={productId} prodStock={stock[productId]} />
                )
            })
        )
    }
}

class Product extends React.Component {
    renderRow(row) {
        console.log('renderRow');
        return (
            <tr key={row.size_id}>
                <td>{row.size_text}</td>
            </tr>
        );
    }

    renderSortableRow(row) {
        var objRow = {
            "quantity": row.quantity,
            "size_text": row.size_text,
            "simple_id": row.simple_id
        }

        return objRow;
    }

    renderProductDetails(product) {
        const inStockProdStr = [];
        const outStockProdStr = [];

        if (product.length) { // product is an array
            product.forEach(p => {
                if (p.quantity === 0) {
                    outStockProdStr.push(this.renderRow(p))
                }
                else {
                    inStockProdStr.push(this.renderSortableRow(p))
                }
            });
        }
        else { // product is an object
            if (typeof product === 'object') {
                Object.keys(product).forEach(id => {
                    if (product[id].quantity === 0) {
                        outStockProdStr.push(this.renderRow(product[id]))
                    }
                    else {
                        inStockProdStr.push(this.renderSortableRow(product[id]))
                    }
                }
                );
            }
        }

        let outStockContent;

        if (outStockProdStr.length > 0) {
            outStockContent = (
                <div className={'col-md-5 right-table'}>
                    <h5>Out of stock</h5>
                    <table className={'table'}>
                        <thead className={"thead-dark"}>
                            <tr>
                                <th scope="col">Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outStockProdStr.map(p => p)}
                        </tbody>
                    </table>
                </div>
            )
        }
        else {
            outStockContent = (<div className={'col-md-5 right-table'}></div>);
        }

        let inStockContent;

        if (inStockProdStr.length > 0) {
            inStockContent = (
                <div className="col-md-5">
                    <InStockTable stockArr={inStockProdStr} />
                </div>
            )
        }
        else {
            inStockContent = (<div></div>)
        }

        return (
            <div className={'row product-tables'}>
                {
                    inStockContent
                }
                {
                    outStockContent
                }
                <div className={"col-md-2"}></div>
            </div >
        );
    }

    render() {
        return (
            <div className={"product-container"}>
                <div id="product-info">
                    <h3 className={"title"}>Product ID. {this.props.productId}</h3>
                    <hr />
                    <div id="product-line-detail">
                        {
                            this.renderProductDetails(this.props.prodStock)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

class InStockTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            sortOrder: '',
        }

        this.compareBy.bind(this);
        this.sortBy.bind(this);
    }

    componentDidMount() {
        this.state.data.sort(this.compareBy('quantity'));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.stockArr !== prevState.data) {
            return { data: nextProps.stockArr };
        }
        return null;
    }

    compareBy(key) {
        if (this.state.sortOrder === '' || this.state.sortOrder === 'asc') {
            this.setState({ sortOrder: 'des' });
            return function (a, b) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
                return 0;
            }
        }
        else {
            this.setState({ sortOrder: 'asc' });
            return function (a, b) {
                if (a[key] < b[key]) return 1;
                if (a[key] > b[key]) return -1;
                return 0;
            }
        }
    }

    sortBy(key) {
        let arrayCopy = [...this.state.data];
        arrayCopy.sort(this.compareBy(key));
        this.setState({ data: arrayCopy });
    }

    render() {
        return (
            <div className={'left-table'}>
                <h5>In stock</h5>
                <table className={'table'}>
                    <thead className="thead-dark">
                        <tr>
                            <th className={"align-center sortable"} onClick={() => this.sortBy('quantity')} scope="col">Qty {
                                (this.state.sortOrder === '' || this.state.sortOrder === 'asc')
                                    ? <i className={"fa fa-chevron-down"}></i> : <i className={"fa fa-chevron-up"}></i>
                            }
                            </th>
                            <th scope="col">Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map((s) => (
                                <tr key={s.simple_id}>
                                    <td className={"align-center"}>{s.quantity}</td>
                                    <td>{s.size_text}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RequestForm;
