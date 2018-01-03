<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 21.12.2017
 * Time: 15:43
 */

namespace App\Model;


use Nette\Database\Context;

class CartModel
{
    /**
     * @var Context
     */
    private $db;

    public function __construct(Context $db)
    {
        $this->db = $db;
    }

    public function addProductToCart($data)
    {
        $this->db->query('INSERT INTO cart', $data);
    }

    /**
     * Returns cart by user ID
     * @param $userId
     * @return \Nette\Database\ResultSet
     */
    public function getCart($userId)
    {
        $cart = $this->db->query("SELECT c.id AS cartId, c.date, c.count, p.* FROM cart AS c INNER JOIN product AS p ON p.id = c.product_id WHERE c.user_id = ? ORDER BY date ASC", $userId);
        return $cart;
    }

    /**
     * Delete from cart by cart ID
     * @param $cartId
     */
    public function removeFromCart($cartId)
    {
        $this->db->query("DELETE FROM cart WHERE id = ?", $cartId);
    }

    /**
     * Delete from cart by user
     * @param $userId
     */
    public function removeAllFromCart($userId)
    {
        $this->db->query("DELETE FROM cart WHERE user_id = ?", $userId);
    }

    /**
     * Checks if the same order exists in cart
     * @param $userId
     * @param $date
     * @param $productId
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function checkCartForSameOrder($date, $userId, $productId)
    {
        return $this->db->query("SELECT * FROM cart WHERE DATE_FORMAT(date, '%Y-%m-%d') = ? AND user_id = ? AND product_id = ?", $date->format('Y-m-d'), $userId, $productId)->fetch();
    }
}