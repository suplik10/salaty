<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 7.1.2018
 * Time: 21:10
 */

namespace App\Model;


use Nette\Database\Context;
use Nette\Utils\DateTime;

class OrderModel
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
     * Creating order
     * @param $userId
     * @param $totalPrice
     * @param $date
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function createOrder($userId, $totalPrice, $date, $description)
    {
        $data = [
            'user_id' => $userId,
            'total_price' => $totalPrice,
            'date' => $date,
            'description' => $description
        ];
        $this->db->query("INSERT INTO orders", $data);
        $order = $this->db->query("SELECT * FROM orders ORDER BY id DESC LIMIT 1")->fetch();

        return $order;
    }

    /**
     * Adding products to order
     * @param $products
     * @param $orderId
     */
    public function addProductsToOrder($products, $orderId)
    {
        $data = [];
        foreach ($products as $product) {
            $data[] = [
                'product_id' => $product->id,
                'order_id' => $orderId,
                'quantity' => $product->count,
                'product_price' => $product->price,
                'date' => $product->date
            ];
        }
        $this->db->query("INSERT INTO product2order", $data);
    }

    /**
     * Returns ballance of user account
     * @param $userId
     */
    public function getUserWallet($userId)
    {
        $order = $this->db->query("SELECT SUM(p2o.quantity * p2o.product_price) AS total_price FROM orders AS o INNER JOIN product2order AS p2o ON p2o.order_id = o.id WHERE o.user_id = ?", $userId)->fetch();
        $wallet = $this->db->query("SELECT SUM(money) AS money FROM wallet WHERE user_id = ?", $userId)->fetch();
        return $wallet->money - $order->total_price;
    }

    public function getUserOrders($userId)
    {
        return $this->db->query("SELECT p2o.*, p.* FROM product2order p2o INNER JOIN product AS p ON p.id = p2o.product_id INNER JOIN orders AS o ON o.id = p2o.order_id WHERE o.user_id = ? ORDER BY p2o.date DESC", $userId);
    }

    public function getProductOrdersByDate($date)
    {
        return $this->db->query("SELECT p2o.product_id, p2o.order_id, p2o.product_price, p2o.date, SUM(p2o.quantity) AS quantity, p.* FROM product2order AS p2o INNER JOIN product AS p ON p.id = p2o.product_id WHERE DATE_FORMAT(p2o.date, '%Y-%m-%d') = ? GROUP BY p.id", $date);
    }

    public function getProductIngredientsByDate($date)
    {
        return $this->db->query("SELECT i2p.weight * SUM(p2o.quantity) AS total_weight,i2p.product_id, i.name FROM ingredients2product AS i2p INNER JOIN product2order AS p2o ON p2o.product_id = i2p.product_id INNER JOIN ingredients AS i ON i.id = i2p.ingredient_id WHERE DATE_FORMAT(p2o.date, '%Y-%m-%d') = ? GROUP BY i2p.ingredient_id", $date);
    }

    public function getProductOrdersByTerm($dateFrom, $dateTo)
    {
        return $this->db->query("SELECT p2o.product_id, p2o.order_id, p2o.product_price, p2o.date, SUM(p2o.quantity) AS quantity, p.* FROM product2order AS p2o INNER JOIN product AS p ON p.id = p2o.product_id WHERE DATE_FORMAT(p2o.date, '%Y-%m-%d') >= ?  AND DATE_FORMAT(p2o.date, '%Y-%m-%d') <= ? GROUP BY p.id", $dateFrom, $dateTo);
    }

    public function getProductIngredientsByTerm($dateFrom, $dateTo)
    {
        return $this->db->query("SELECT i2p.weight * SUM(p2o.quantity) AS total_weight,i2p.product_id, i.name FROM ingredients2product AS i2p INNER JOIN product2order AS p2o ON p2o.product_id = i2p.product_id INNER JOIN ingredients AS i ON i.id = i2p.ingredient_id WHERE DATE_FORMAT(p2o.date, '%Y-%m-%d') >= ? AND DATE_FORMAT(p2o.date, '%Y-%m-%d') <= ? GROUP BY i2p.ingredient_id", $dateFrom, $dateTo);
    }

    public function getUsersOrdersByDate($date)
    {
        return $this->db->query("SELECT p.*, u.firstname, u.lastname, u.factory, o.user_id, SUM(p2o.quantity) AS quantity, p2o.product_price, o.description AS order_description FROM orders AS o INNER JOIN user AS u ON u.id = o.user_id INNER JOIN product2order AS p2o ON p2o.order_id = o.id INNER JOIN product AS p ON p.id = p2o.product_id WHERE DATE_FORMAT(p2o.date, '%Y-%m-%d') = ? GROUP BY u.id, p.id", $date);
    }

    public function getOrderDescriptionsByDate($date)
    {
        return $this->db->query("SELECT o.description, u.firstname, u.lastname, u.factory FROM orders AS o INNER JOIN user AS u ON u.id = o.user_id INNER JOIN product2order AS p2o ON p2o.order_id = o.id WHERE DATE_FORMAT(p2o.date, '%Y-%m-%d') = ? AND o.description IS NOT NULL GROUP BY o.id", $date);
    }
}