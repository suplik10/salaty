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
     * Returns active products
     * @return \Nette\Database\ResultSet
     */
    public function getProducts()
    {
        $products = $this->db->query('SELECT p.*, c.name AS category_name FROM product AS p INNER JOIN category AS c ON c.id = p.category_id WHERE p.active = 1 AND c.active = 1 ORDER BY p.rank ASC');
        return $products;
    }

    /**
     * Returns all products
     * @return \Nette\Database\ResultSet
     */
    public function getAllProducts()
    {
        $products = $this->db->query('SELECT p.*, c.name AS category_name FROM product AS p INNER JOIN category AS c ON c.id = p.category_id ORDER BY p.rank ASC');
        return $products;
    }

    /**
     * Returns product by ID
     * @param $productId
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function getProduct($productId)
    {
        $product = $this->db->query('SELECT * FROM product WHERE id = ?', $productId)->fetch();
        return $product;
    }

    public function changeProductState($productId, $state)
    {
        $this->db->query("UPDATE product SET active = ? WHERE id = ?", $state, $productId);
    }

    public function getProductsWithIngredients()
    {
        return $this->db->query("SELECT p.id, p.name AS product_name, i.name AS ingredient_name, i2p.weight AS ingredient_weight FROM product AS p INNER JOIN ingredients2product AS i2p ON i2p.product_id = p.id INNER JOIN ingredients AS i ON i.id = i2p.ingredient_id");
    }

    public function getProductIngredients($productId)
    {
        return $this->db->query("SELECT i2p.*, i.name FROM ingredients2product AS i2p INNER JOIN ingredients AS i ON i.id = i2p.ingredient_id WHERE i2p.product_id = ?", $productId);
    }

    public function editProduct($data, $ingredients, $ingredients2)
    {
        $this->db->query("UPDATE product SET name = ?, description = ?, price = ?, category_id = ?, weight = ?, rank = ? WHERE id = ?", $data['name'], $data['description'], $data['price'], $data['category_id'], $data['weight'], $data['rank'], $data['id']);
        if(!empty($ingredients2)){
            $this->db->query("DELETE FROM ingredients2product WHERE product_id = ? AND ingredient_id NOT IN(?)", $data['id'], array_values($ingredients2));
        }else{
            $this->db->query("DELETE FROM ingredients2product WHERE product_id = ?", $data['id']);
        }

        $actualIngredients = $this->db->query("SELECT * FROM ingredients2product WHERE product_id = ?", $data['id'])->fetchAll();
        foreach ($actualIngredients as $actualIngredient) {
            unset($ingredients[$actualIngredient->ingredient_id]);
        }
        if (!empty($ingredients)) {
            $this->db->query("INSERT INTO ingredients2product", array_values($ingredients));
        }
    }

    public function changeProductImg($img, $productId)
    {
        $this->db->query("UPDATE product SET img = ? WHERE id = ?", $img, $productId);
    }

    public function editProductIngredients($data, $productId)
    {
        foreach ($data as $id => $weight) {
            $this->db->query("UPDATE ingredients2product SET weight = ? WHERE product_id = ? AND ingredient_id = ?", $weight, $productId, $id);
        }
    }

    public function addProduct($data, $ingredients){
        $this->db->query("INSERT INTO product", $data);
        $product = $this->db->query("SELECT * FROM product ORDER BY id DESC LIMIT 1")->fetch();
        $ingredientsData = [];
        foreach($ingredients as $ingredient){
            $ingredientsData[] = [
              'ingredient_id' => $ingredient,
              'product_id' => $product->id
            ];
        }
        if(!empty($ingredientsData)){
            $this->db->query("INSERT INTO ingredients2product",$ingredientsData);
        }
    }
}