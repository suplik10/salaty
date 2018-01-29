<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 19.12.2017
 * Time: 16:21
 */

namespace App\Model;


use Nette\Database\Context;
use Nette\Neon\Exception;
use Nette\Security\AuthenticationException;
use Nette\Security\Passwords;

class UserModel
{
    /**
     * @var Context
     */
    private $db;

    const USER_ROLE_ADMIN = 2;

    public function __construct(Context $db)
    {
        $this->db = $db;
    }

    /**
     * Checks if user is registered
     * @param $email
     * @return bool
     * @throws AuthenticationException
     */
    public function isUserRegistered($email)
    {
        $user = $this->db->query('SELECT * FROM user WHERE email = ? ', $email)->fetch();
        if ($user) {
            throw new AuthenticationException('Tento email je již používaný.');
        }
        return false;
    }

    /**
     * User registration
     * @param $userData
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function register($userData)
    {
        $userData['password'] = Passwords::hash($userData['password']);
        $this->db->query('INSERT INTO user', $userData);
        $user = $this->db->query("SELECT * FROM user ORDER BY id DESC LIMIT 1 ")->fetch();
        return $user;
    }

    /**
     * Is email in database for news / offers ?
     * @param $email
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function isEmailSignedForNewsletter($email)
    {
        $isSignedUp = $this->db->query('SELECT * FROM newsletter WHERE email = ?', $email)->fetch();

        return $isSignedUp;
    }

    /**
     * Sign up for emails such as news / offers
     * @param $email
     */
    public function signForNewsletter($email)
    {
        $email = ['email' => $email];
        $this->db->query('INSERT INTO newsletter', $email);
    }

    /**
     * Sign out of receiving emails
     * @param $email
     */
    public function signOutNewsletter($email)
    {
        $this->db->query('DELETE FROM newsletter WHERE email = ?', $email);
    }

    /**
     * @param $data
     */
    public function editUser($data)
    {
        $this->db->query('UPDATE user SET firstname = ?, lastname = ?, email = ?, phone = ?, factory = ?, street = ?, city = ?, postalcode = ? WHERE id = ?',
            $data['firstname'],
            $data['lastname'],
            $data['email'],
            $data['phone'],
            $data['factory'],
            $data['street'],
            $data['city'],
            $data['postalcode'],
            $data['id']
        );
    }

    /**
     * Edit user password
     * @param $password
     * @param $userId
     */
    public function editUserPassword($password, $userId)
    {
        $this->db->query('UPDATE user SET password = ? WHERE id = ?', Passwords::hash($password), $userId);
    }


    /**
     * Returns user by ID
     * @param $userId
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function getUserById($userId)
    {
        $user = $this->db->query('SELECT * FROM user WHERE id = ?', $userId)->fetch();
        return $user;
    }

    public function changeUserStatus($userId, $status)
    {
        $this->db->query("UPDATE user SET active = ? WHERE id = ?", $status, $userId);
    }

    public function getAllUsers()
    {
        return $this->db->query("SELECT u.*, ur.name AS role_name, (SELECT SUM(w.money - (SELECT SUM(p2o.product_price * p2o.quantity) FROM product2order AS p2o INNER JOIN orders AS o ON o.id = p2o.order_id WHERE o.user_id = u.id))
FROM wallet AS w WHERE w.user_id = u.id ) AS balance FROM user AS u INNER JOIN user_role AS ur ON ur.id = u.user_role_id ");
    }

    public function getUserByEmail($email)
    {
        return $this->db->query("SELECT * FROM user WHERE email = ?", $email);
    }

    public function changeUserPassword($password, $userId)
    {
        $this->db->query("UPDATE user SET password = ? WHERE id = ?", Passwords::hash($password), $userId);
    }
}