const crypto = require('crypto');
const { Op } = require('sequelize');
const { SiteVisit } = require('../models/mysql');

// Public endpoint to record a visit
exports.recordVisit = async (req, res, next) => {
  try {
    const path = req.body.path || req.originalUrl;
    const rawIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      null;

    const ipHash = rawIp
      ? crypto.createHash('sha256').update(rawIp).digest('hex')
      : null;

    await SiteVisit.create({
      path,
      ipHash,
      userAgent: (req.headers['user-agent'] || '').slice(0, 255),
      userId: req.user?.id || null,
    });

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

// Admin-only: aggregated visit stats
exports.getVisitStats = async (req, res, next) => {
  try {
    const { from, to, groupBy = 'day' } = req.query;

    let format;
    switch (groupBy) {
      case 'hour':
        format = '%Y-%m-%d %H:00:00';
        break;
      case 'month':
        format = '%Y-%m-01';
        break;
      case 'year':
        format = '%Y-01-01';
        break;
      default:
        format = '%Y-%m-%d';
    }

    const where = {};
    if (from) {
      where.visitedAt = { [Op.gte]: new Date(from) };
    }
    if (to) {
      where.visitedAt = {
        ...(where.visitedAt || {}),
        [Op.lte]: new Date(to),
      };
    }

    const buckets = await SiteVisit.findAll({
      where,
      attributes: [
        [SiteVisit.sequelize.fn('DATE_FORMAT', SiteVisit.sequelize.col('visited_at'), format), 'bucket'],
        [SiteVisit.sequelize.fn('COUNT', SiteVisit.sequelize.col('*')), 'count'],
      ],
      group: ['bucket'],
      order: [[SiteVisit.sequelize.literal('bucket'), 'ASC']],
      raw: true,
    });

    const total = await SiteVisit.count({ where });

    return res.status(200).json({
      status: 'success',
      data: {
        total,
        buckets,
      },
    });
  } catch (error) {
    return next(error);
  }
};
