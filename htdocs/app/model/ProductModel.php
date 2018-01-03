<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 21.12.2017
 * Time: 14:41
 */

namespace App\Model;


use Nette\Database\Context;

class ProductModel
{
    /**
     * @var Context
     */
    private $db;

    public function __construct(Context $db)
    {
        $this->db = $db;
    }

    /**
     * Returns products with categories
     * @return \Nette\Database\ResultSet
     */
    public function getProducts(){
        $products = $this->db->query('SELECT p.*, c.name AS category_name FROM product AS p INNER JOIN category AS c ON c.id = p.category_id ORDER BY p.rank ASC');
        return $products;
    }

    /**
     * Returns product by ID
     * @param $productId
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function getProduct($productId){
        $product = $this->db->query('SELECT * FROM product WHERE id = ?', $productId)->fetch();
        return $product;
    }
}