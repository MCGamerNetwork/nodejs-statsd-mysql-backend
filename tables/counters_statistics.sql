-- Stadard DELIMITER is $$

-- Counters statistics table
CREATE  TABLE `counters_statistics` (
    `timestamp` BIGINT NOT NULL ,
    `name` VARCHAR(255) NOT NULL ,
    `absolute` INT(11) NOT NULL ,
    `relative` INT(11) NOT NULL ,
PRIMARY KEY (`timestamp`,`name`) )$$
