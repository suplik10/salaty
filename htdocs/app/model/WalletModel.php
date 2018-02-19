<?php
/**
 * Created by PhpStorm.
 * User: viktorkafka
 * Date: 26/01/2018
 * Time: 14:02
 */

namespace App\Model;


use Nette\Database\Context;

class WalletModel
{

    /**
     * @var Context
     */
    private $db;

    public function __construct(Context $db)
    {
        $this->db = $db;
    }

    public function addMoney($data)
    {
        $this->db->query('INSERT INTO wallet', $data);
    }

    public function getWalletByUser($userId)
    {
        return $this->db->query("SELECT * FROM wallet WHERE user_id = ?", $userId);
    }
}