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
    public function createOrder($userId, $totalPrice, $date)
    {
        $data = [
            'user_id' => $userId,
            'total_price' => $totalPrice,
            'date' => $date
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
        $order = $this->db->query("SELECT SUM(total_price) AS total_price FROM orders WHERE user_id = ?", $userId)->fetch();
        $wallet = $this->db->query("SELECT SUM(money) AS money FROM wallet WHERE user_id = ?", $userId)->fetch();
        return $wallet->money - $order->total_price;
    }

    public function getUserOrders($userId)
    {
        return $this->db->query("SELECT p2o.*, p.* FROM product2order p2o INNER JOIN product AS p ON p.id = p2o.product_id INNER JOIN orders AS o ON o.id = p2o.order_id WHERE o.user_id = ? ORDER BY p2o.date DESC", $userId);
    }
}