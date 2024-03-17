const urlParams = new URLSearchParams(window.location.search);

let currentPage = Number(urlParams.get("page")) || 1; // data of current page
const itemsPerPage = Number(urlParams.get("limit")) || 5; // Number of data to display per page
let totalPages = 0; // Total number of pages
let products = []; // Array to store all products data

const fetchProducts = () => {
  //   fetch
  fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}`)
    .then((response) => response.json())
    .then((data) => {
      products = data.products;
      totalPages = data.totalPages;

      const productList = document.getElementById("product-list");
      productList.innerHTML = "";

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // pagination for each products
      products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${product.product_Id}</td>
            <td>${product.product_Name}</td>
            <td>${product.category_Name}</td>
            <td>${product.category_Id}</td>
            <td>
              <a href="/pages/update-product.html?id=${
                product.product_Id
              }" class="btn btn-primary btn-sm me-2">Edit</a>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct(${
                product.product_Id
              })">Delete</button>
            </td>
          `;
        productList.appendChild(row);
      });

      //Now pagination
      const paginationSection = document.getElementById("pagination-section");
      paginationSection.innerHTML = "";
      const pageNumberButtons = [];
      for (let index = 1; index < totalPages + 1; index++) {
        let active = false;
        if (currentPage === index) {
          active = true;
        }

        const li = `
          <li class="page-item ${active ? "active" : ""}">
            <a class="page-link" href="/?page=${index}&limit=${itemsPerPage}">
              ${index}
            </a>
          </li>
        `;
        pageNumberButtons.push(li);
      }

      const paginationComponent = `<nav aria-label="...">
        <ul class="pagination justify-content-center">
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="/?page=${
              currentPage - 1
            }&limit=${itemsPerPage}" tabindex="-1">
              Previous
            </a>
          </li>
        ${pageNumberButtons.map((li) => {
          console.log(li);
          return li;
        })}
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="/?page=${
              currentPage + 1
            }&limit=${itemsPerPage}">
              Next
            </a>
          </li>
        </ul>
      </nav>`;
      paginationSection.innerHTML = paginationComponent;
    })
    .catch((error) => console.error(error));
};

// Delete a product
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Product deleted successfully");
          fetchProducts(currentPage); // Refresh
          location.reload();
        } else {
          alert("Failed to delete the product");
        }
      })
      .catch((error) => console.error(error));
  }
}

fetchProducts();
